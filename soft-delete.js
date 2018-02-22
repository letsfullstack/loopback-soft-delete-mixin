/**
 * Loopback SoftDelete Mixins
 * 
 * I write my own mixins because current available softdelete mixin is not working in Node.js v4.x.x, I believe it is caused by ES6
 * This code is forked from https://github.com/gausie/loopback-softdelete-mixin
 * 
 * To implement, Copy this file to mixins folder, and add "SoftDelete": true in mixins on YourModel.json file
 *  
 * To delete a row or data, don't use destroyAll etc., use YourModel.delete
 * To find data that is considered deleted, add includeDeleted: true in where filter
 * 
 * @author Saggaf Arsyad
 * @email saggaf@area54labs.net
 * @since 26/03/2016
 */

module.exports = function(Model, options) {
    /**
     * This mixins have 2 properties, deletedAt and isDeleted
     * deletedAt is to store timestamp 
     * isDeleted is a boolean that indicates a row or data has been deleted
     *
     * I'm using mysql and my database have different naming convention with loopback models
     * So I add mysql properties and set my own columnName    
     */
    Model.defineProperty('deletedAt', {
        type: Date,
        required: false,
        mysql: {
            columnName: "deleted_at",
            dataType: "timestamp",
            dataLength: null,
            dataPrecision: null,
            dataScale: null,
            nullable: "Y"
        },
        postgresql: {
            columnName: "deleted_at",
            dataType: "timestamp",
            dataLength: null,
            dataPrecision: null,
            dataScale: null,
            nullable: "Y"
        }
    })
    Model.defineProperty('isDeleted', {
        type: Boolean,
        required: true,
        default: false,
        mysql: {
            columnName: "is_deleted",
            dataType: "tinyint",
            dataLength: null,
            dataPrecision: 1,
            dataScale: 0,
            nullable: "Y"
        },
        postgresql: {
            columnName: "is_deleted",
            dataType: "tinyint",
            dataLength: null,
            dataPrecision: 1,
            dataScale: 0,
            nullable: "Y"
        }
    })

    /**
     * Soft Delete, this will set a row or data that is considered deleted
     *
     * @param   {object}    where    Where Filter
     * @param   {function}  cb       Async Callback
     */
    Model.delete = function(where, cb) {
        if (where === undefined) {
            where = { 'isDeleted': false }
        } else {
            where = { and: [where, { 'isDeleted': false }] }
        }

        return Model.updateAll(where, {
                ['deletedAt']: new Date(),
                ['isDeleted']: true
            }).then(result => (typeof cb === 'function') ? cb(null, result) : result)
            .catch(error => (typeof cb === 'function') ? cb(error) : Promise.reject(error))
    }

    /**
     * Find
     * This will defaultly search for isDeleted = false
     *
     * @param   {object}    where    Where Filter
     * @param   {function}  cb       Async Callback
     */
    const _find = Model.find
    Model.find = function(filter, cb) {
        if (filter === undefined) {
            filter = {}
        } else {
            if (!filter.where) filter.where = {}

            if (!filter.includeDeleted) {
                filter.where = {
                    and: [filter.where, {
                        'isDeleted': false
                    }]
                }
            }
        }

        return _find.call(Model, filter, cb)
    }
}