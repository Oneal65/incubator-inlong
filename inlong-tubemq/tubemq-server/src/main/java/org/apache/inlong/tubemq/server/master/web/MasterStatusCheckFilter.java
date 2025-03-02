/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.inlong.tubemq.server.master.web;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.inlong.tubemq.corebase.utils.TStringUtils;
import org.apache.inlong.tubemq.server.master.TMaster;
import org.apache.inlong.tubemq.server.master.metamanage.MetaDataService;

public class MasterStatusCheckFilter implements Filter {

    private TMaster master;
    private MetaDataService defMetaDataService;

    public MasterStatusCheckFilter(TMaster master) {
        this.master = master;
        this.defMetaDataService =
                this.master.getMetaDataService();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        if (!defMetaDataService.isSelfMaster()) {
            String masterAdd =
                    defMetaDataService.getMasterAddress();
            if (masterAdd == null) {
                throw new IOException("Not found the master node address!");
            }
            StringBuilder sBuilder =
                    new StringBuilder(512).append("http://")
                            .append(masterAdd).append(":")
                            .append(master.getMasterConfig().getWebPort())
                            .append(req.getRequestURI());
            if (TStringUtils.isNotBlank(req.getQueryString())) {
                sBuilder.append("?").append(req.getQueryString());
            }
            resp.sendRedirect(sBuilder.toString());
            return;
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
