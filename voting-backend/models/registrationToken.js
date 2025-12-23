module.exports = (sequelize, DataTypes) => {
    const RegistrationToken = sequelize.define('RegistrationToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        election_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        voter_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        commitment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('unused', 'used'),
            defaultValue: 'unused'
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true
    });
    return RegistrationToken;
};
