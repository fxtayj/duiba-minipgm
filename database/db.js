const Sequelize = require('sequelize');

const uuid = require('node-uuid');

const config = require('../config/config');

console.log('init sequelize...');

/**
1、统一主键，名称必须是id，类型必须是STRING(50)；
2、主键可以自己指定，也可以由框架自动生成（如果为null或undefined）；
3、所有字段默认为NOT NULL，除非显式指定；
统一timestamp机制，每个Model必须有createdAt、updatedAt和version，分别记录创建时间、修改时间和版本号。
其中，createdAt和updatedAt以BIGINT存储时间戳，最大的好处是无需处理时区，排序方便。
version每次修改时自增。
 */

function generateId() {
  return uuid.v4(); //1、uuid.v1(); -->基于时间戳生成  （time-based） 2、uuid.v4(); -->随机生成  (random)
}

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const ID_TYPE = Sequelize.STRING(40);

function defineModel(name, attributes) {
  var attrs = {};

  attrs.id = {
    type: ID_TYPE,
    primaryKey: true
  };

  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === 'object' && value['type']) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false
      };
    }
  }

  attrs.createdAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  };
  attrs.updatedAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  };
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: false
  };

  //打印加载的数据库表结构
  // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
  //     if (k === 'type') {
  //         for (let key in Sequelize) {
  //             if (key === 'ABSTRACT' || key === 'NUMBER') {
  //                 continue;
  //             }
  //             let dbType = Sequelize[key];
  //             if (typeof dbType === 'function') {
  //                 if (v instanceof dbType) {
  //                     if (v._length) {
  //                         return `${dbType.key}(${v._length})`;
  //                     }
  //                     return dbType.key;
  //                 }
  //                 if (v === dbType) {
  //                     return dbType.key;
  //                 }
  //             }
  //         }
  //     }
  //     return v;
  // }, '  '));

  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: function (obj) {
        let now = Date.now();
        if (obj.isNewRecord) {
          console.log('will create entity...');
          if (!obj.id) {
            obj.id = generateId();
          }
          obj.createdAt = now;
          obj.updatedAt = now;
          obj.version = 0;
        } else {
          console.log('will update entity...');
          obj.updatedAt = now;
          obj.version++;
        }
      }
    }
  });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
  defineModel: defineModel,
  sync: () => {
    // only allow create ddl in non-production environment:
    if (process.env.NODE_ENV !== 'production') {
      console.log('db.js - sync() called');
      return sequelize.sync({
        force: true
      });
    } else {
      throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    }
  }
};

for (let type of TYPES) {
  exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;
exp.sequelize = sequelize;

module.exports = exp;
