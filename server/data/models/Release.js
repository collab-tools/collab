var constants = require('../../constants');
//new
module.exports = function (Sequelize, DataTypes) {
    return Sequelize.define(constants.RELEASE_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        releaseCount: DataTypes.INT,
        url: DataTypes.STRING,
        project_id: DataTypes.TEXT,
    }, {
        underscored: true,
        classMethods: {
            isExist: function(id) {
                return this.findById(id).then(function(instance) {
                    return instance !== null;
                })
            },
            getCommit: function(id) {
                return this.findById(id);
            },
        },
    });
};