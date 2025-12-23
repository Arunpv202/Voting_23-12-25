module.exports = (sequelize, DataTypes) => {
    const Election = sequelize.define('Election', {
        election_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        election_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creator_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        result_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('created', 'registration', 'setup_completed', 'voting', 'ended'),
            defaultValue: 'created'
        },
        merkle_root: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true
    });
    return Election;
};
