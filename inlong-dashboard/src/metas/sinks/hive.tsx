/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import i18n from '@/i18n';
import type { FieldItemType } from '@/metas/common';
import EditableTable from '@/components/EditableTable';
import { sourceFields } from './common/sourceFields';

const hiveFieldTypes = [
  'string',
  'varchar',
  'char',
  'tinyint',
  'smallint',
  'int',
  'bigint',
  'float',
  'double',
  'decimal',
  'numeric',
  'boolean',
  'binary',
  'timestamp',
  'date',
  // 'interval',
].map(item => ({
  label: item,
  value: item,
}));

export const hive: FieldItemType[] = [
  {
    type: 'input',
    label: i18n.t('meta.Sinks.Hive.DbName'),
    name: 'dbName',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
    }),
    _renderTable: true,
  },
  {
    type: 'input',
    label: i18n.t('meta.Sinks.Hive.TableName'),
    name: 'tableName',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
    }),
    _renderTable: true,
  },
  {
    type: 'radio',
    label: i18n.t('meta.Sinks.EnableCreateResource'),
    name: 'enableCreateResource',
    rules: [{ required: true }],
    initialValue: 1,
    tooltip: i18n.t('meta.Sinks.EnableCreateResourceHelp'),
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      options: [
        {
          label: i18n.t('basic.Yes'),
          value: 1,
        },
        {
          label: i18n.t('basic.No'),
          value: 0,
        },
      ],
    }),
  },
  {
    type: 'input',
    label: i18n.t('meta.Sinks.Username'),
    name: 'username',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
    }),
    _renderTable: true,
  },
  {
    type: 'password',
    label: i18n.t('meta.Sinks.Password'),
    name: 'password',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
    }),
  },
  {
    type: 'input',
    label: 'JDBC URL',
    name: 'jdbcUrl',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      placeholder: 'jdbc:hive2://127.0.0.1:10000',
    }),
  },
  {
    type: 'input',
    label: i18n.t('meta.Sinks.Hive.DataPath'),
    name: 'dataPath',
    rules: [{ required: true }],
    tooltip: i18n.t('meta.Sinks.DataPathHelp'),
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      placeholder: 'hdfs://127.0.0.1:9000/user/hive/warehouse/default',
    }),
  },
  {
    type: 'input',
    label: i18n.t('meta.Sinks.Hive.ConfDir'),
    name: 'hiveConfDir',
    rules: [{ required: true }],
    tooltip: i18n.t('meta.Sinks.Hive.ConfDirHelp'),
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      placeholder: '/usr/hive/conf',
    }),
  },
  {
    name: 'fileFormat',
    type: 'radio',
    label: i18n.t('meta.Sinks.Hive.FileFormat'),
    initialValue: 'TextFile',
    rules: [{ required: true }],
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      options: [
        {
          label: 'TextFile',
          value: 'TextFile',
        },
        {
          label: 'SequenceFile',
          value: 'SequenceFile',
        },
        // {
        //   label: 'RcFile',
        //   value: 'RcFile',
        // },
        {
          label: 'OrcFile',
          value: 'OrcFile',
        },
        {
          label: 'Parquet',
          value: 'Parquet',
        },
        {
          label: 'Avro',
          value: 'Avro',
        },
      ],
    }),
  },
  {
    name: 'dataEncoding',
    type: 'radio',
    label: i18n.t('meta.Sinks.Hive.DataEncoding'),
    initialValue: 'UTF-8',
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      options: [
        {
          label: 'UTF-8',
          value: 'UTF-8',
        },
        {
          label: 'GBK',
          value: 'GBK',
        },
      ],
    }),
    rules: [{ required: true }],
  },
  {
    name: 'dataSeparator',
    type: 'select',
    label: i18n.t('meta.Sinks.Hive.DataSeparator'),
    initialValue: '124',
    props: values => ({
      disabled: [110, 130].includes(values?.status),
      dropdownMatchSelectWidth: false,
      options: [
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.VerticalLine'),
          value: '124',
        },
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.Comma'),
          value: '44',
        },
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.DoubleQuotes'),
          value: '34',
        },
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.Asterisk'),
          value: '42',
        },
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.Space'),
          value: '32',
        },
        {
          label: i18n.t('meta.Sinks.Hive.DataSeparator.Semicolon'),
          value: '59',
        },
      ],
      useInput: true,
      useInputProps: {
        placeholder: 'ASCII',
        disabled: [110, 130].includes(values?.status),
      },
      style: { width: 100 },
    }),
    rules: [
      {
        required: true,
        type: 'number',
        transform: val => +val,
        min: 0,
        max: 127,
      } as any,
    ],
  },
  {
    name: 'sinkFieldList',
    type: EditableTable,
    props: values => ({
      size: 'small',
      columns: getFieldListColumns(values),
      canDelete: ![110, 130].includes(values?.status),
    }),
  },
  {
    name: 'partitionFieldList',
    label: i18n.t('meta.Sinks.Hive.PartitionFieldList'),
    type: EditableTable,
    tooltip: i18n.t('meta.Sinks.Hive.PartitionFieldListHelp'),
    props: {
      size: 'small',
      required: false,
      columns: [
        {
          title: i18n.t('meta.Sinks.Hive.FieldName'),
          dataIndex: 'fieldName',
          rules: [{ required: true }],
        },
        {
          title: i18n.t('meta.Sinks.Hive.FieldType'),
          dataIndex: 'fieldType',
          type: 'select',
          initialValue: 'string',
          props: {
            options: ['string', 'timestamp'].map(item => ({
              label: item,
              value: item,
            })),
          },
        },
        {
          title: i18n.t('meta.Sinks.Hive.FieldFormat'),
          dataIndex: 'fieldFormat',
          type: 'autocomplete',
          props: {
            options: ['MICROSECONDS', 'MILLISECONDS', 'SECONDS', 'SQL', 'ISO_8601'].map(item => ({
              label: item,
              value: item,
            })),
          },
          rules: [{ required: true }],
          visible: (text, record) => record.fieldType === 'timestamp',
        },
      ],
    },
  },
];

const getFieldListColumns = sinkValues => {
  return [
    ...sourceFields,
    {
      title: `HIVE${i18n.t('meta.Sinks.Hive.FieldName')}`,
      dataIndex: 'fieldName',
      initialValue: '',
      rules: [
        { required: true },
        {
          pattern: /^[a-z][0-9a-z_]*$/,
          message: i18n.t('meta.Sinks.Hive.FieldNameRule'),
        },
      ],
      props: (text, record, idx, isNew) => ({
        disabled: [110, 130].includes(sinkValues?.status as number) && !isNew,
      }),
    },
    {
      title: `HIVE${i18n.t('meta.Sinks.Hive.FieldType')}`,
      dataIndex: 'fieldType',
      initialValue: hiveFieldTypes[0].value,
      type: 'select',
      props: (text, record, idx, isNew) => ({
        options: hiveFieldTypes,
        disabled: [110, 130].includes(sinkValues?.status as number) && !isNew,
      }),
      rules: [{ required: true }],
    },
    {
      title: i18n.t('meta.Sinks.Hive.IsMetaField'),
      dataIndex: 'isMetaField',
      initialValue: 0,
      type: 'select',
      props: (text, record, idx, isNew) => ({
        options: [
          {
            label: i18n.t('basic.Yes'),
            value: 1,
          },
          {
            label: i18n.t('basic.No'),
            value: 0,
          },
        ],
      }),
    },
    {
      title: i18n.t('meta.Sinks.Hive.FieldFormat'),
      dataIndex: 'fieldFormat',
      initialValue: 0,
      type: 'autocomplete',
      props: (text, record, idx, isNew) => ({
        options: ['MICROSECONDS', 'MILLISECONDS', 'SECONDS', 'SQL', 'ISO_8601'].map(item => ({
          label: item,
          value: item,
        })),
      }),
      visible: (text, record) =>
        ['bigint', 'date', 'timestamp'].includes(record.fieldType as string),
    },
    {
      title: i18n.t('meta.Sinks.Hive.FieldDescription'),
      dataIndex: 'fieldComment',
      initialValue: '',
    },
  ];
};
