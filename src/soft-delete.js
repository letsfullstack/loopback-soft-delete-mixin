import _debug from './debug';

const debug = _debug();

export default (Model, { deletedAt = 'deletedAt', _isDeleted = '_isDeleted', scrub = false }) => {
  const model = Model;

  debug('SoftDelete mixin for model %s', model.modelName);

  debug('options', { deletedAt, _isDeleted, scrub });

  const { properties } = model.definition;

  let scrubbed = {};
  if (scrub !== false) {
    let propertiesToScrub = scrub;
    if (!Array.isArray(propertiesToScrub)) {
      propertiesToScrub = Object.keys(properties)
        .filter((prop) => !properties[prop].id && prop !== _isDeleted);
    }
    scrubbed = propertiesToScrub.reduce((obj, prop) => ({ ...obj, [prop]: null }), {});
  }

  model.defineProperty(deletedAt, { type: Date, required: false });
  model.defineProperty(_isDeleted, { type: Boolean, required: false, default: false });

  model.destroyAll = function softDestroyAll(where, cb) {
    return model.updateAll(where, { ...scrubbed, [deletedAt]: new Date(), [_isDeleted]: true })
      .then((result) => ((typeof cb === 'function') ? cb(null, result) : result))
      .catch((error) => ((typeof cb === 'function') ? cb(error) : Promise.reject(error)));
  };

  model.remove = model.destroyAll;
  model.deleteAll = model.destroyAll;

  model.destroyById = function softDestroyById(id, cb) {
    return model.updateAll({ id }, { ...scrubbed, [deletedAt]: new Date(), [_isDeleted]: true })
      .then((result) => ((typeof cb === 'function') ? cb(null, result) : result))
      .catch((error) => ((typeof cb === 'function') ? cb(error) : Promise.reject(error)));
  };

  model.removeById = model.destroyById;
  model.deleteById = model.destroyById;

  model.prototype.destroy = function softDestroy(options, cb) {
    const callback = (cb === undefined && typeof options === 'function') ? options : cb;

    return this.updateAttributes({ ...scrubbed, [deletedAt]: new Date(), [_isDeleted]: true })
      .then((result) => ((typeof cb === 'function') ? callback(null, result) : result))
      .catch((error) => ((typeof cb === 'function') ? callback(error) : Promise.reject(error)));
  };

  model.prototype.remove = model.prototype.destroy;
  model.prototype.delete = model.prototype.destroy;

  // Emulate default scope but with more flexibility.
  const queryNonDeleted = {
    or: [
      { [_isDeleted]: null },
      { [_isDeleted]: false },
    ],
  };

  const { findOrCreate } = model;
  model.findOrCreate = function findOrCreateDeleted(query = {}, ...rest) {
    const queryNew = query;

    if (!query.where) queryNew.where = {};

    if (!query.deleted) {
      queryNew.where = { and: [query.where, queryNonDeleted] };
    }

    return findOrCreate.call(model, query, ...rest);
  };

  const { find } = model;
  model.find = function findDeleted(query = {}, ...rest) {
    const queryNew = query;

    if (!query.where) queryNew.where = {};

    if (!query.deleted) {
      queryNew.where = { and: [query.where, queryNonDeleted] };
    }

    return find.call(model, query, ...rest);
  };

  const { count } = model;
  model.count = function countDeleted(where = {}, ...rest) {
    // Because count only receives a 'where', there's nowhere to ask for the deleted entities.
    const whereNotDeleted = { and: [where, queryNonDeleted] };
    return count.call(model, whereNotDeleted, ...rest);
  };

  const { update } = model;
  model.updateAll = function updateDeleted(where = {}, ...rest) {
    // Because update/updateAll only receives a 'where',
    // there's nowhere to ask for the deleted entities.
    const whereNotDeleted = { and: [where, queryNonDeleted] };
    return update.call(model, whereNotDeleted, ...rest);
  };
  model.update = model.updateAll;
};
