/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.inlong.agent.core.task;

import org.apache.inlong.agent.common.AbstractDaemon;
import org.apache.inlong.agent.conf.AgentConfiguration;
import org.apache.inlong.agent.conf.JobProfile;
import org.apache.inlong.agent.core.AgentManager;
import org.apache.inlong.agent.db.JobProfileDb;
import org.apache.inlong.agent.utils.ThreadUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import static org.apache.inlong.agent.constant.CommonConstants.POSITION_SUFFIX;
import static org.apache.inlong.agent.constant.FetcherConstants.AGENT_HEARTBEAT_INTERVAL;
import static org.apache.inlong.agent.constant.FetcherConstants.DEFAULT_AGENT_FETCHER_INTERVAL;

/**
 * used to store task position to db, task position is stored as properties in JobProfile.
 * where key is task read file name and value is task sink position
 * note that this class is generated
 */
public class TaskPositionManager extends AbstractDaemon {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskPositionManager.class);
    private static volatile TaskPositionManager taskPositionManager = null;
    private final AgentManager agentManager;
    private final JobProfileDb jobConfDb;
    private final AgentConfiguration conf;
    private ConcurrentHashMap<String, ConcurrentHashMap<String, Long>> jobTaskPositionMap;

    private TaskPositionManager(AgentManager agentManager) {
        this.conf = AgentConfiguration.getAgentConf();
        this.agentManager = agentManager;
        this.jobConfDb = agentManager.getJobManager().getJobConfDb();
        this.jobTaskPositionMap = new ConcurrentHashMap<>();
    }

    /**
     * task position manager singleton, can only generated by agent manager
     */
    public static TaskPositionManager getTaskPositionManager(AgentManager agentManager) {
        if (taskPositionManager == null) {
            synchronized (TaskPositionManager.class) {
                if (taskPositionManager == null) {
                    taskPositionManager = new TaskPositionManager(agentManager);
                }
            }
        }
        return taskPositionManager;
    }

    /**
     * get taskPositionManager singleton
     */
    public static TaskPositionManager getTaskPositionManager() {
        if (taskPositionManager == null) {
            throw new RuntimeException("task position manager has not been initialized by agentManager");
        }
        return taskPositionManager;
    }

    @Override
    public void start() throws Exception {
        submitWorker(taskPositionFlushThread());
    }

    private Runnable taskPositionFlushThread() {
        return () -> {
            while (isRunnable()) {
                try {
                    // check pending jobs and try to submit again.
                    for (String jobId : jobTaskPositionMap.keySet()) {
                        JobProfile jobProfile = jobConfDb.getJobById(jobId);
                        if (jobProfile == null) {
                            LOGGER.warn("jobProfile {} cannot be found in db, "
                                    + "might be deleted by standalone mode, now delete job position in memory", jobId);
                            deleteJobPosition(jobId);
                            continue;
                        }
                        flushJobProfile(jobId, jobProfile);
                    }
                    int flushTime = conf.getInt(AGENT_HEARTBEAT_INTERVAL,
                            DEFAULT_AGENT_FETCHER_INTERVAL);
                    TimeUnit.SECONDS.sleep(flushTime);
                } catch (Throwable ex) {
                    LOGGER.error("error caught", ex);
                    ThreadUtils.threadThrowableHandler(Thread.currentThread(), ex);
                }
            }
        };
    }

    private void flushJobProfile(String jobId, JobProfile jobProfile) {
        jobTaskPositionMap.get(jobId).forEach(
                (fileName, position) -> jobProfile.setLong(fileName + POSITION_SUFFIX, position)
        );
        if (jobConfDb.checkJobfinished(jobProfile)) {
            LOGGER.info("Cannot update job profile {}, delete memory job in jobTaskPosition", jobId);
            deleteJobPosition(jobId);
        } else {
            jobConfDb.updateJobProfile(jobProfile);
        }
    }

    private void deleteJobPosition(String jobId) {
        jobTaskPositionMap.remove(jobId);
    }

    @Override
    public void stop() throws Exception {
        waitForTerminate();
    }

    /**
     * update job sink position
     *
     * @param size add this size to beforePosition
     */
    public void updateSinkPosition(String jobInstanceId, String sourcePath, long size) {
        ConcurrentHashMap<String, Long> positionTemp = new ConcurrentHashMap<>();
        ConcurrentHashMap<String, Long> position = jobTaskPositionMap.putIfAbsent(jobInstanceId, positionTemp);
        if (position == null) {
            position = positionTemp;
        }
        Long beforePosition = position.getOrDefault(sourcePath, 0L);
        position.put(sourcePath, beforePosition + size);
    }

    public ConcurrentHashMap<String, Long> getTaskPositionMap(String jobId) {
        return jobTaskPositionMap.get(jobId);
    }

    public ConcurrentHashMap<String, ConcurrentHashMap<String, Long>> getJobTaskPosition() {
        return jobTaskPositionMap;
    }
}
