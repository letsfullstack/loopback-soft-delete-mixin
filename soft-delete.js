'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);var _extends6 = require('babel-runtime/helpers/extends');var _extends7 = _interopRequireDefault(_extends6);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _debug2 = require('./debug');var _debug3 = _interopRequireDefault(_debug2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var debug = (0, _debug3.default)();exports.default =

function (Model, _ref) {var _ref$deletedAt = _ref.deletedAt,deletedAt = _ref$deletedAt === undefined ? 'deletedAt' : _ref$deletedAt,_ref$_isDeleted = _ref._isDeleted,_isDeleted = _ref$_isDeleted === undefined ? '_isDeleted' : _ref$_isDeleted,_ref$scrub = _ref.scrub,scrub = _ref$scrub === undefined ? false : _ref$scrub;
  var model = Model;

  debug('SoftDelete mixin for model %s', model.modelName);

  debug('options', { deletedAt: deletedAt, _isDeleted: _isDeleted, scrub: scrub });var

  properties = model.definition.properties;

  var scrubbed = {};
  if (scrub !== false) {
    var propertiesToScrub = scrub;
    if (!Array.isArray(propertiesToScrub)) {
      propertiesToScrub = (0, _keys2.default)(properties).
      filter(function (prop) {return !properties[prop].id && prop !== _isDeleted;});
    }
    scrubbed = propertiesToScrub.reduce(function (obj, prop) {return (0, _extends7.default)({}, obj, (0, _defineProperty3.default)({}, prop, null));}, {});
  }

  model.defineProperty(deletedAt, { type: Date, required: false });
  model.defineProperty(_isDeleted, { type: Boolean, required: false, default: false });

  model.destroyAll = function softDestroyAll(where, cb) {var _extends3;
    return model.updateAll(where, (0, _extends7.default)({}, scrubbed, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, deletedAt, new Date()), (0, _defineProperty3.default)(_extends3, _isDeleted, true), _extends3))).
    then(function (result) {return typeof cb === 'function' ? cb(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? cb(error) : _promise2.default.reject(error);});
  };

  model.remove = model.destroyAll;
  model.deleteAll = model.destroyAll;

  model.destroyById = function softDestroyById(id, cb) {var _extends4;
    return model.updateAll({ id: id }, (0, _extends7.default)({}, scrubbed, (_extends4 = {}, (0, _defineProperty3.default)(_extends4, deletedAt, new Date()), (0, _defineProperty3.default)(_extends4, _isDeleted, true), _extends4))).
    then(function (result) {return typeof cb === 'function' ? cb(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? cb(error) : _promise2.default.reject(error);});
  };

  model.removeById = model.destroyById;
  model.deleteById = model.destroyById;

  model.prototype.destroy = function softDestroy(options, cb) {var _extends5;
    var callback = cb === undefined && typeof options === 'function' ? options : cb;

    return this.updateAttributes((0, _extends7.default)({}, scrubbed, (_extends5 = {}, (0, _defineProperty3.default)(_extends5, deletedAt, new Date()), (0, _defineProperty3.default)(_extends5, _isDeleted, true), _extends5))).
    then(function (result) {return typeof cb === 'function' ? callback(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? callback(error) : _promise2.default.reject(error);});
  };

  model.prototype.remove = model.prototype.destroy;
  model.prototype.delete = model.prototype.destroy;

  // Emulate default scope but with more flexibility.
  var queryNonDeleted = {
    or: [(0, _defineProperty3.default)({},
    _isDeleted, null), (0, _defineProperty3.default)({},
    _isDeleted, false)] };var



  findOrCreate = model.findOrCreate;
  model.findOrCreate = function findOrCreateDeleted() {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var queryNew = query;

    if (!query.where) queryNew.where = {};

    if (!query.deleted) {
      queryNew.where = { and: [query.where, queryNonDeleted] };
    }for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {rest[_key - 1] = arguments[_key];}

    return findOrCreate.call.apply(findOrCreate, [model, query].concat(rest));
  };var

  find = model.find;
  model.find = function findDeleted() {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var queryNew = query;

    if (!query.where) queryNew.where = {};

    if (!query.deleted) {
      queryNew.where = { and: [query.where, queryNonDeleted] };
    }for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {rest[_key2 - 1] = arguments[_key2];}

    return find.call.apply(find, [model, query].concat(rest));
  };var

  count = model.count;
  model.count = function countDeleted() {var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Because count only receives a 'where', there's nowhere to ask for the deleted entities.
    var whereNotDeleted = { and: [where, queryNonDeleted] };for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {rest[_key3 - 1] = arguments[_key3];}
    return count.call.apply(count, [model, whereNotDeleted].concat(rest));
  };var

  update = model.update;
  model.updateAll = function updateDeleted() {var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Because update/updateAll only receives a 'where',
    // there's nowhere to ask for the deleted entities.
    var whereNotDeleted = { and: [where, queryNonDeleted] };for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {rest[_key4 - 1] = arguments[_key4];}
    return update.call.apply(update, [model, whereNotDeleted].concat(rest));
  };
  model.update = model.updateAll;
};module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvZnQtZGVsZXRlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiTW9kZWwiLCJkZWxldGVkQXQiLCJfaXNEZWxldGVkIiwic2NydWIiLCJtb2RlbCIsIm1vZGVsTmFtZSIsInByb3BlcnRpZXMiLCJkZWZpbml0aW9uIiwic2NydWJiZWQiLCJwcm9wZXJ0aWVzVG9TY3J1YiIsIkFycmF5IiwiaXNBcnJheSIsImZpbHRlciIsInByb3AiLCJpZCIsInJlZHVjZSIsIm9iaiIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsIkRhdGUiLCJyZXF1aXJlZCIsIkJvb2xlYW4iLCJkZWZhdWx0IiwiZGVzdHJveUFsbCIsInNvZnREZXN0cm95QWxsIiwid2hlcmUiLCJjYiIsInVwZGF0ZUFsbCIsInRoZW4iLCJyZXN1bHQiLCJjYXRjaCIsImVycm9yIiwicmVqZWN0IiwicmVtb3ZlIiwiZGVsZXRlQWxsIiwiZGVzdHJveUJ5SWQiLCJzb2Z0RGVzdHJveUJ5SWQiLCJyZW1vdmVCeUlkIiwiZGVsZXRlQnlJZCIsInByb3RvdHlwZSIsImRlc3Ryb3kiLCJzb2Z0RGVzdHJveSIsIm9wdGlvbnMiLCJjYWxsYmFjayIsInVuZGVmaW5lZCIsInVwZGF0ZUF0dHJpYnV0ZXMiLCJkZWxldGUiLCJxdWVyeU5vbkRlbGV0ZWQiLCJvciIsImZpbmRPckNyZWF0ZSIsImZpbmRPckNyZWF0ZURlbGV0ZWQiLCJxdWVyeSIsInF1ZXJ5TmV3IiwiZGVsZXRlZCIsImFuZCIsInJlc3QiLCJjYWxsIiwiZmluZCIsImZpbmREZWxldGVkIiwiY291bnQiLCJjb3VudERlbGV0ZWQiLCJ3aGVyZU5vdERlbGV0ZWQiLCJ1cGRhdGUiLCJ1cGRhdGVEZWxldGVkIl0sIm1hcHBpbmdzIjoiMGdCQUFBLGlDOztBQUVBLElBQU1BLFFBQVEsc0JBQWQsQzs7QUFFZSxVQUFDQyxLQUFELFFBQWtGLDJCQUF4RUMsU0FBd0UsQ0FBeEVBLFNBQXdFLGtDQUE1RCxXQUE0RCx5Q0FBL0NDLFVBQStDLENBQS9DQSxVQUErQyxt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QUF4QixDQUZ1RCxtQ0FBTlEsSUFBTSx5RUFBTkEsSUFBTTtBQUd2RCxXQUFPSSxNQUFNSCxJQUFOLGVBQVdwRCxLQUFYLEVBQWtCeUQsZUFBbEIsU0FBc0NOLElBQXRDLEVBQVA7QUFDRCxHQUpELENBdEYrRjs7QUE0RnZGTyxRQTVGdUYsR0E0RjVFMUQsS0E1RjRFLENBNEZ2RjBELE1BNUZ1RjtBQTZGL0YxRCxRQUFNdUIsU0FBTixHQUFrQixTQUFTb0MsYUFBVCxHQUE0QyxLQUFyQnRDLEtBQXFCLHVFQUFiLEVBQWE7QUFDNUQ7QUFDQTtBQUNBLFFBQU1vQyxrQkFBa0IsRUFBRVAsS0FBSyxDQUFDN0IsS0FBRCxFQUFRc0IsZUFBUixDQUFQLEVBQXhCLENBSDRELG1DQUFOUSxJQUFNLHlFQUFOQSxJQUFNO0FBSTVELFdBQU9PLE9BQU9OLElBQVAsZ0JBQVlwRCxLQUFaLEVBQW1CeUQsZUFBbkIsU0FBdUNOLElBQXZDLEVBQVA7QUFDRCxHQUxEO0FBTUFuRCxRQUFNMEQsTUFBTixHQUFlMUQsTUFBTXVCLFNBQXJCO0FBQ0QsQyIsImZpbGUiOiJzb2Z0LWRlbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVidWcgZnJvbSAnLi9kZWJ1Zyc7XG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCk7XG5cbmV4cG9ydCBkZWZhdWx0IChNb2RlbCwgeyBkZWxldGVkQXQgPSAnZGVsZXRlZEF0JywgX2lzRGVsZXRlZCA9ICdfaXNEZWxldGVkJywgc2NydWIgPSBmYWxzZSB9KSA9PiB7XG4gIGNvbnN0IG1vZGVsID0gTW9kZWw7XG5cbiAgZGVidWcoJ1NvZnREZWxldGUgbWl4aW4gZm9yIG1vZGVsICVzJywgbW9kZWwubW9kZWxOYW1lKTtcblxuICBkZWJ1Zygnb3B0aW9ucycsIHsgZGVsZXRlZEF0LCBfaXNEZWxldGVkLCBzY3J1YiB9KTtcblxuICBjb25zdCB7IHByb3BlcnRpZXMgfSA9IG1vZGVsLmRlZmluaXRpb247XG5cbiAgbGV0IHNjcnViYmVkID0ge307XG4gIGlmIChzY3J1YiAhPT0gZmFsc2UpIHtcbiAgICBsZXQgcHJvcGVydGllc1RvU2NydWIgPSBzY3J1YjtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcGVydGllc1RvU2NydWIpKSB7XG4gICAgICBwcm9wZXJ0aWVzVG9TY3J1YiA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpXG4gICAgICAgIC5maWx0ZXIoKHByb3ApID0+ICFwcm9wZXJ0aWVzW3Byb3BdLmlkICYmIHByb3AgIT09IF9pc0RlbGV0ZWQpO1xuICAgIH1cbiAgICBzY3J1YmJlZCA9IHByb3BlcnRpZXNUb1NjcnViLnJlZHVjZSgob2JqLCBwcm9wKSA9PiAoeyAuLi5vYmosIFtwcm9wXTogbnVsbCB9KSwge30pO1xuICB9XG5cbiAgbW9kZWwuZGVmaW5lUHJvcGVydHkoZGVsZXRlZEF0LCB7IHR5cGU6IERhdGUsIHJlcXVpcmVkOiBmYWxzZSB9KTtcbiAgbW9kZWwuZGVmaW5lUHJvcGVydHkoX2lzRGVsZXRlZCwgeyB0eXBlOiBCb29sZWFuLCByZXF1aXJlZDogZmFsc2UsIGRlZmF1bHQ6IGZhbHNlIH0pO1xuXG4gIG1vZGVsLmRlc3Ryb3lBbGwgPSBmdW5jdGlvbiBzb2Z0RGVzdHJveUFsbCh3aGVyZSwgY2IpIHtcbiAgICByZXR1cm4gbW9kZWwudXBkYXRlQWxsKHdoZXJlLCB7IC4uLnNjcnViYmVkLCBbZGVsZXRlZEF0XTogbmV3IERhdGUoKSwgW19pc0RlbGV0ZWRdOiB0cnVlIH0pXG4gICAgICAudGhlbigocmVzdWx0KSA9PiAoKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgPyBjYihudWxsLCByZXN1bHQpIDogcmVzdWx0KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+ICgodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSA/IGNiKGVycm9yKSA6IFByb21pc2UucmVqZWN0KGVycm9yKSkpO1xuICB9O1xuXG4gIG1vZGVsLnJlbW92ZSA9IG1vZGVsLmRlc3Ryb3lBbGw7XG4gIG1vZGVsLmRlbGV0ZUFsbCA9IG1vZGVsLmRlc3Ryb3lBbGw7XG5cbiAgbW9kZWwuZGVzdHJveUJ5SWQgPSBmdW5jdGlvbiBzb2Z0RGVzdHJveUJ5SWQoaWQsIGNiKSB7XG4gICAgcmV0dXJuIG1vZGVsLnVwZGF0ZUFsbCh7IGlkIH0sIHsgLi4uc2NydWJiZWQsIFtkZWxldGVkQXRdOiBuZXcgRGF0ZSgpLCBbX2lzRGVsZXRlZF06IHRydWUgfSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+ICgodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSA/IGNiKG51bGwsIHJlc3VsdCkgOiByZXN1bHQpKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4gKCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpID8gY2IoZXJyb3IpIDogUHJvbWlzZS5yZWplY3QoZXJyb3IpKSk7XG4gIH07XG5cbiAgbW9kZWwucmVtb3ZlQnlJZCA9IG1vZGVsLmRlc3Ryb3lCeUlkO1xuICBtb2RlbC5kZWxldGVCeUlkID0gbW9kZWwuZGVzdHJveUJ5SWQ7XG5cbiAgbW9kZWwucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBzb2Z0RGVzdHJveShvcHRpb25zLCBjYikge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKGNiID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpID8gb3B0aW9ucyA6IGNiO1xuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlQXR0cmlidXRlcyh7IC4uLnNjcnViYmVkLCBbZGVsZXRlZEF0XTogbmV3IERhdGUoKSwgW19pc0RlbGV0ZWRdOiB0cnVlIH0pXG4gICAgICAudGhlbigocmVzdWx0KSA9PiAoKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgPyBjYWxsYmFjayhudWxsLCByZXN1bHQpIDogcmVzdWx0KSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+ICgodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSA/IGNhbGxiYWNrKGVycm9yKSA6IFByb21pc2UucmVqZWN0KGVycm9yKSkpO1xuICB9O1xuXG4gIG1vZGVsLnByb3RvdHlwZS5yZW1vdmUgPSBtb2RlbC5wcm90b3R5cGUuZGVzdHJveTtcbiAgbW9kZWwucHJvdG90eXBlLmRlbGV0ZSA9IG1vZGVsLnByb3RvdHlwZS5kZXN0cm95O1xuXG4gIC8vIEVtdWxhdGUgZGVmYXVsdCBzY29wZSBidXQgd2l0aCBtb3JlIGZsZXhpYmlsaXR5LlxuICBjb25zdCBxdWVyeU5vbkRlbGV0ZWQgPSB7XG4gICAgb3I6IFtcbiAgICAgIHsgW19pc0RlbGV0ZWRdOiBudWxsIH0sXG4gICAgICB7IFtfaXNEZWxldGVkXTogZmFsc2UgfSxcbiAgICBdLFxuICB9O1xuXG4gIGNvbnN0IHsgZmluZE9yQ3JlYXRlIH0gPSBtb2RlbDtcbiAgbW9kZWwuZmluZE9yQ3JlYXRlID0gZnVuY3Rpb24gZmluZE9yQ3JlYXRlRGVsZXRlZChxdWVyeSA9IHt9LCAuLi5yZXN0KSB7XG4gICAgY29uc3QgcXVlcnlOZXcgPSBxdWVyeTtcblxuICAgIGlmICghcXVlcnkud2hlcmUpIHF1ZXJ5TmV3LndoZXJlID0ge307XG5cbiAgICBpZiAoIXF1ZXJ5LmRlbGV0ZWQpIHtcbiAgICAgIHF1ZXJ5TmV3LndoZXJlID0geyBhbmQ6IFtxdWVyeS53aGVyZSwgcXVlcnlOb25EZWxldGVkXSB9O1xuICAgIH1cblxuICAgIHJldHVybiBmaW5kT3JDcmVhdGUuY2FsbChtb2RlbCwgcXVlcnksIC4uLnJlc3QpO1xuICB9O1xuXG4gIGNvbnN0IHsgZmluZCB9ID0gbW9kZWw7XG4gIG1vZGVsLmZpbmQgPSBmdW5jdGlvbiBmaW5kRGVsZXRlZChxdWVyeSA9IHt9LCAuLi5yZXN0KSB7XG4gICAgY29uc3QgcXVlcnlOZXcgPSBxdWVyeTtcblxuICAgIGlmICghcXVlcnkud2hlcmUpIHF1ZXJ5TmV3LndoZXJlID0ge307XG5cbiAgICBpZiAoIXF1ZXJ5LmRlbGV0ZWQpIHtcbiAgICAgIHF1ZXJ5TmV3LndoZXJlID0geyBhbmQ6IFtxdWVyeS53aGVyZSwgcXVlcnlOb25EZWxldGVkXSB9O1xuICAgIH1cblxuICAgIHJldHVybiBmaW5kLmNhbGwobW9kZWwsIHF1ZXJ5LCAuLi5yZXN0KTtcbiAgfTtcblxuICBjb25zdCB7IGNvdW50IH0gPSBtb2RlbDtcbiAgbW9kZWwuY291bnQgPSBmdW5jdGlvbiBjb3VudERlbGV0ZWQod2hlcmUgPSB7fSwgLi4ucmVzdCkge1xuICAgIC8vIEJlY2F1c2UgY291bnQgb25seSByZWNlaXZlcyBhICd3aGVyZScsIHRoZXJlJ3Mgbm93aGVyZSB0byBhc2sgZm9yIHRoZSBkZWxldGVkIGVudGl0aWVzLlxuICAgIGNvbnN0IHdoZXJlTm90RGVsZXRlZCA9IHsgYW5kOiBbd2hlcmUsIHF1ZXJ5Tm9uRGVsZXRlZF0gfTtcbiAgICByZXR1cm4gY291bnQuY2FsbChtb2RlbCwgd2hlcmVOb3REZWxldGVkLCAuLi5yZXN0KTtcbiAgfTtcblxuICBjb25zdCB7IHVwZGF0ZSB9ID0gbW9kZWw7XG4gIG1vZGVsLnVwZGF0ZUFsbCA9IGZ1bmN0aW9uIHVwZGF0ZURlbGV0ZWQod2hlcmUgPSB7fSwgLi4ucmVzdCkge1xuICAgIC8vIEJlY2F1c2UgdXBkYXRlL3VwZGF0ZUFsbCBvbmx5IHJlY2VpdmVzIGEgJ3doZXJlJyxcbiAgICAvLyB0aGVyZSdzIG5vd2hlcmUgdG8gYXNrIGZvciB0aGUgZGVsZXRlZCBlbnRpdGllcy5cbiAgICBjb25zdCB3aGVyZU5vdERlbGV0ZWQgPSB7IGFuZDogW3doZXJlLCBxdWVyeU5vbkRlbGV0ZWRdIH07XG4gICAgcmV0dXJuIHVwZGF0ZS5jYWxsKG1vZGVsLCB3aGVyZU5vdERlbGV0ZWQsIC4uLnJlc3QpO1xuICB9O1xuICBtb2RlbC51cGRhdGUgPSBtb2RlbC51cGRhdGVBbGw7XG59O1xuIl19
