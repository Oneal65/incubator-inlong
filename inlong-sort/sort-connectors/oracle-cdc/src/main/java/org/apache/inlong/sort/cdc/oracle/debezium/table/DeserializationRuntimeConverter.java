/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.inlong.sort.cdc.oracle.debezium.table;

import io.debezium.relational.history.TableChanges.TableChange;
import java.io.Serializable;
import org.apache.kafka.connect.data.Schema;

/**
 * Runtime converter that converts objects of Debezium into objects of Flink Table & SQL internal
 * data structures.
 */
public interface DeserializationRuntimeConverter extends Serializable {
    Object convert(Object dbzObj, Schema schema) throws Exception;

    Object convert(Object dbzObj, Schema schema, TableChange tableSchema) throws Exception;
}
