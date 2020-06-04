'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);var _extends6 = require('babel-runtime/helpers/extends');var _extends7 = _interopRequireDefault(_extends6);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _debug2 = require('./debug');var _debug3 = _interopRequireDefault(_debug2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var debug = (0, _debug3.default)();exports.default =

function (Model, _ref) {var _ref$deletedAt = _ref.deletedAt,deletedAt = _ref$deletedAt === undefined ? 'deletedAt' : _ref$deletedAt,_ref$_isDeleted = _ref._isDeleted,_isDeleted = _ref$_isDeleted === undefined ? '_isDeleted' : _ref$_isDeleted,_ref$scrub = _ref.scrub,scrub = _ref$scrub === undefined ? false : _ref$scrub;
  debug('SoftDelete mixin for Model %s', Model.modelName);

  debug('options', { deletedAt: deletedAt, _isDeleted: _isDeleted, scrub: scrub });

  var properties = Model.definition.properties;

  var scrubbed = {};
  if (scrub !== false) {
    var propertiesToScrub = scrub;
    if (!Array.isArray(propertiesToScrub)) {
      propertiesToScrub = (0, _keys2.default)(properties).
      filter(function (prop) {return !properties[prop].id && prop !== _isDeleted;});
    }
    scrubbed = propertiesToScrub.reduce(function (obj, prop) {return (0, _extends7.default)({}, obj, (0, _defineProperty3.default)({}, prop, null));}, {});
  }

  Model.defineProperty(deletedAt, { type: Date, required: false });
  Model.defineProperty(_isDeleted, { type: Boolean, required: false, default: false });

  Model.destroyAll = function softDestroyAll(where, cb) {var _extends3;
    return Model.updateAll(where, (0, _extends7.default)({}, scrubbed, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, deletedAt, new Date()), (0, _defineProperty3.default)(_extends3, _isDeleted, true), _extends3))).
    then(function (result) {return typeof cb === 'function' ? cb(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? cb(error) : _promise2.default.reject(error);});
  };

  Model.remove = Model.destroyAll;
  Model.deleteAll = Model.destroyAll;

  Model.destroyById = function softDestroyById(id, cb) {var _extends4;
    return Model.updateAll({ id: id }, (0, _extends7.default)({}, scrubbed, (_extends4 = {}, (0, _defineProperty3.default)(_extends4, deletedAt, new Date()), (0, _defineProperty3.default)(_extends4, _isDeleted, true), _extends4))).
    then(function (result) {return typeof cb === 'function' ? cb(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? cb(error) : _promise2.default.reject(error);});
  };

  Model.removeById = Model.destroyById;
  Model.deleteById = Model.destroyById;

  Model.prototype.destroy = function softDestroy(options, cb) {var _extends5;
    var callback = cb === undefined && typeof options === 'function' ? options : cb;

    return this.updateAttributes((0, _extends7.default)({}, scrubbed, (_extends5 = {}, (0, _defineProperty3.default)(_extends5, deletedAt, new Date()), (0, _defineProperty3.default)(_extends5, _isDeleted, true), _extends5))).
    then(function (result) {return typeof cb === 'function' ? callback(null, result) : result;}).
    catch(function (error) {return typeof cb === 'function' ? callback(error) : _promise2.default.reject(error);});
  };

  Model.prototype.remove = Model.prototype.destroy;
  Model.prototype.delete = Model.prototype.destroy;

  // Emulate default scope but with more flexibility.
  var queryNonDeleted = {
    or: [(0, _defineProperty3.default)({},
    _isDeleted, null), (0, _defineProperty3.default)({},
    _isDeleted, false)] };



  var _findOrCreate = Model.findOrCreate;
  Model.findOrCreate = function findOrCreateDeleted() {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!query.where) query.where = {};

    if (!query.deleted) {
      query.where = { and: [query.where, queryNonDeleted] };
    }for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {rest[_key - 1] = arguments[_key];}

    return _findOrCreate.call.apply(_findOrCreate, [Model, query].concat(rest));
  };

  var _find = Model.find;
  Model.find = function findDeleted() {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!query.where) query.where = {};

    if (!query.deleted) {
      query.where = { and: [query.where, queryNonDeleted] };
    }for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {rest[_key2 - 1] = arguments[_key2];}

    return _find.call.apply(_find, [Model, query].concat(rest));
  };

  var _count = Model.count;
  Model.count = function countDeleted() {var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Because count only receives a 'where', there's nowhere to ask for the deleted entities.
    var whereNotDeleted = { and: [where, queryNonDeleted] };for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {rest[_key3 - 1] = arguments[_key3];}
    return _count.call.apply(_count, [Model, whereNotDeleted].concat(rest));
  };

  var _update = Model.update;
  Model.update = Model.updateAll = function updateDeleted() {var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Because update/updateAll only receives a 'where', there's nowhere to ask for the deleted entities.
    var whereNotDeleted = { and: [where, queryNonDeleted] };for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {rest[_key4 - 1] = arguments[_key4];}
    return _update.call.apply(_update, [Model, whereNotDeleted].concat(rest));
  };
};module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvZnQtZGVsZXRlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiTW9kZWwiLCJkZWxldGVkQXQiLCJfaXNEZWxldGVkIiwic2NydWIiLCJtb2RlbE5hbWUiLCJwcm9wZXJ0aWVzIiwiZGVmaW5pdGlvbiIsInNjcnViYmVkIiwicHJvcGVydGllc1RvU2NydWIiLCJBcnJheSIsImlzQXJyYXkiLCJmaWx0ZXIiLCJwcm9wIiwiaWQiLCJyZWR1Y2UiLCJvYmoiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJEYXRlIiwicmVxdWlyZWQiLCJCb29sZWFuIiwiZGVmYXVsdCIsImRlc3Ryb3lBbGwiLCJzb2Z0RGVzdHJveUFsbCIsIndoZXJlIiwiY2IiLCJ1cGRhdGVBbGwiLCJ0aGVuIiwicmVzdWx0IiwiY2F0Y2giLCJlcnJvciIsInJlamVjdCIsInJlbW92ZSIsImRlbGV0ZUFsbCIsImRlc3Ryb3lCeUlkIiwic29mdERlc3Ryb3lCeUlkIiwicmVtb3ZlQnlJZCIsImRlbGV0ZUJ5SWQiLCJwcm90b3R5cGUiLCJkZXN0cm95Iiwic29mdERlc3Ryb3kiLCJvcHRpb25zIiwiY2FsbGJhY2siLCJ1bmRlZmluZWQiLCJ1cGRhdGVBdHRyaWJ1dGVzIiwiZGVsZXRlIiwicXVlcnlOb25EZWxldGVkIiwib3IiLCJfZmluZE9yQ3JlYXRlIiwiZmluZE9yQ3JlYXRlIiwiZmluZE9yQ3JlYXRlRGVsZXRlZCIsInF1ZXJ5IiwiZGVsZXRlZCIsImFuZCIsInJlc3QiLCJjYWxsIiwiX2ZpbmQiLCJmaW5kIiwiZmluZERlbGV0ZWQiLCJfY291bnQiLCJjb3VudCIsImNvdW50RGVsZXRlZCIsIndoZXJlTm90RGVsZXRlZCIsIl91cGRhdGUiLCJ1cGRhdGUiLCJ1cGRhdGVEZWxldGVkIl0sIm1hcHBpbmdzIjoiMGdCQUFBLGlDO0FBQ0EsSUFBTUEsUUFBUSxzQkFBZCxDOztBQUVlLFVBQUNDLEtBQUQsUUFBa0YsMkJBQXhFQyxTQUF3RSxDQUF4RUEsU0FBd0Usa0NBQTVELFdBQTRELHlDQUEv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NEMsS0FBckJ6QyxLQUFxQix1RUFBYixFQUFhO0FBQzNFO0FBQ0EsUUFBTXNDLGtCQUFrQixFQUFFVCxLQUFLLENBQUU3QixLQUFGLEVBQVNzQixlQUFULENBQVAsRUFBeEIsQ0FGMkUsbUNBQU5RLElBQU0seUVBQU5BLElBQU07QUFHM0UsV0FBT1MsUUFBUVIsSUFBUixpQkFBYXZELEtBQWIsRUFBb0I4RCxlQUFwQixTQUF3Q1IsSUFBeEMsRUFBUDtBQUNELEdBSkQ7QUFLRCxDIiwiZmlsZSI6InNvZnQtZGVsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICcuL2RlYnVnJztcbmNvbnN0IGRlYnVnID0gX2RlYnVnKCk7XG5cbmV4cG9ydCBkZWZhdWx0IChNb2RlbCwgeyBkZWxldGVkQXQgPSAnZGVsZXRlZEF0JywgX2lzRGVsZXRlZCA9ICdfaXNEZWxldGVkJywgc2NydWIgPSBmYWxzZSB9KSA9PiB7XG4gIGRlYnVnKCdTb2Z0RGVsZXRlIG1peGluIGZvciBNb2RlbCAlcycsIE1vZGVsLm1vZGVsTmFtZSk7XG5cbiAgZGVidWcoJ29wdGlvbnMnLCB7IGRlbGV0ZWRBdCwgX2lzRGVsZXRlZCwgc2NydWIgfSk7XG5cbiAgY29uc3QgcHJvcGVydGllcyA9IE1vZGVsLmRlZmluaXRpb24ucHJvcGVydGllcztcblxuICBsZXQgc2NydWJiZWQgPSB7fTtcbiAgaWYgKHNjcnViICE9PSBmYWxzZSkge1xuICAgIGxldCBwcm9wZXJ0aWVzVG9TY3J1YiA9IHNjcnViO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzVG9TY3J1YikpIHtcbiAgICAgIHByb3BlcnRpZXNUb1NjcnViID0gT2JqZWN0LmtleXMocHJvcGVydGllcylcbiAgICAgICAgLmZpbHRlcihwcm9wID0+ICFwcm9wZXJ0aWVzW3Byb3BdLmlkICYmIHByb3AgIT09IF9pc0RlbGV0ZWQpO1xuICAgIH1cbiAgICBzY3J1YmJlZCA9IHByb3BlcnRpZXNUb1NjcnViLnJlZHVjZSgob2JqLCBwcm9wKSA9PiAoeyAuLi5vYmosIFtwcm9wXTogbnVsbCB9KSwge30pO1xuICB9XG5cbiAgTW9kZWwuZGVmaW5lUHJvcGVydHkoZGVsZXRlZEF0LCB7dHlwZTogRGF0ZSwgcmVxdWlyZWQ6IGZhbHNlfSk7XG4gIE1vZGVsLmRlZmluZVByb3BlcnR5KF9pc0RlbGV0ZWQsIHt0eXBlOiBCb29sZWFuLCByZXF1aXJlZDogZmFsc2UsIGRlZmF1bHQ6IGZhbHNlfSk7XG5cbiAgTW9kZWwuZGVzdHJveUFsbCA9IGZ1bmN0aW9uIHNvZnREZXN0cm95QWxsKHdoZXJlLCBjYikge1xuICAgIHJldHVybiBNb2RlbC51cGRhdGVBbGwod2hlcmUsIHsgLi4uc2NydWJiZWQsIFtkZWxldGVkQXRdOiBuZXcgRGF0ZSgpLCBbX2lzRGVsZXRlZF06IHRydWUgfSlcbiAgICAgIC50aGVuKHJlc3VsdCA9PiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSA/IGNiKG51bGwsIHJlc3VsdCkgOiByZXN1bHQpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgPyBjYihlcnJvcikgOiBQcm9taXNlLnJlamVjdChlcnJvcikpO1xuICB9O1xuXG4gIE1vZGVsLnJlbW92ZSA9IE1vZGVsLmRlc3Ryb3lBbGw7XG4gIE1vZGVsLmRlbGV0ZUFsbCA9IE1vZGVsLmRlc3Ryb3lBbGw7XG5cbiAgTW9kZWwuZGVzdHJveUJ5SWQgPSBmdW5jdGlvbiBzb2Z0RGVzdHJveUJ5SWQoaWQsIGNiKSB7XG4gICAgcmV0dXJuIE1vZGVsLnVwZGF0ZUFsbCh7IGlkOiBpZCB9LCB7IC4uLnNjcnViYmVkLCBbZGVsZXRlZEF0XTogbmV3IERhdGUoKSwgW19pc0RlbGV0ZWRdOiB0cnVlIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4gKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgPyBjYihudWxsLCByZXN1bHQpIDogcmVzdWx0KVxuICAgICAgLmNhdGNoKGVycm9yID0+ICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpID8gY2IoZXJyb3IpIDogUHJvbWlzZS5yZWplY3QoZXJyb3IpKTtcbiAgfTtcblxuICBNb2RlbC5yZW1vdmVCeUlkID0gTW9kZWwuZGVzdHJveUJ5SWQ7XG4gIE1vZGVsLmRlbGV0ZUJ5SWQgPSBNb2RlbC5kZXN0cm95QnlJZDtcblxuICBNb2RlbC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIHNvZnREZXN0cm95KG9wdGlvbnMsIGNiKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoY2IgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykgPyBvcHRpb25zIDogY2I7XG5cbiAgICByZXR1cm4gdGhpcy51cGRhdGVBdHRyaWJ1dGVzKHsgLi4uc2NydWJiZWQsIFtkZWxldGVkQXRdOiBuZXcgRGF0ZSgpLCBbX2lzRGVsZXRlZF06IHRydWUgfSlcbiAgICAgIC50aGVuKHJlc3VsdCA9PiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSA/IGNhbGxiYWNrKG51bGwsIHJlc3VsdCkgOiByZXN1bHQpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgPyBjYWxsYmFjayhlcnJvcikgOiBQcm9taXNlLnJlamVjdChlcnJvcikpO1xuICB9O1xuXG4gIE1vZGVsLnByb3RvdHlwZS5yZW1vdmUgPSBNb2RlbC5wcm90b3R5cGUuZGVzdHJveTtcbiAgTW9kZWwucHJvdG90eXBlLmRlbGV0ZSA9IE1vZGVsLnByb3RvdHlwZS5kZXN0cm95O1xuXG4gIC8vIEVtdWxhdGUgZGVmYXVsdCBzY29wZSBidXQgd2l0aCBtb3JlIGZsZXhpYmlsaXR5LlxuICBjb25zdCBxdWVyeU5vbkRlbGV0ZWQgPSB7XG4gICAgb3I6IFtcbiAgICAgIHsgW19pc0RlbGV0ZWRdOiBudWxsIH0sXG4gICAgICB7IFtfaXNEZWxldGVkXTogZmFsc2UgfSxcbiAgICBdLFxuICB9O1xuXG4gIGNvbnN0IF9maW5kT3JDcmVhdGUgPSBNb2RlbC5maW5kT3JDcmVhdGU7XG4gIE1vZGVsLmZpbmRPckNyZWF0ZSA9IGZ1bmN0aW9uIGZpbmRPckNyZWF0ZURlbGV0ZWQocXVlcnkgPSB7fSwgLi4ucmVzdCkge1xuICAgIGlmICghcXVlcnkud2hlcmUpIHF1ZXJ5LndoZXJlID0ge307XG5cbiAgICBpZiAoIXF1ZXJ5LmRlbGV0ZWQpIHtcbiAgICAgIHF1ZXJ5LndoZXJlID0geyBhbmQ6IFsgcXVlcnkud2hlcmUsIHF1ZXJ5Tm9uRGVsZXRlZCBdIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIF9maW5kT3JDcmVhdGUuY2FsbChNb2RlbCwgcXVlcnksIC4uLnJlc3QpO1xuICB9O1xuXG4gIGNvbnN0IF9maW5kID0gTW9kZWwuZmluZDtcbiAgTW9kZWwuZmluZCA9IGZ1bmN0aW9uIGZpbmREZWxldGVkKHF1ZXJ5ID0ge30sIC4uLnJlc3QpIHtcbiAgICBpZiAoIXF1ZXJ5LndoZXJlKSBxdWVyeS53aGVyZSA9IHt9O1xuXG4gICAgaWYgKCFxdWVyeS5kZWxldGVkKSB7XG4gICAgICBxdWVyeS53aGVyZSA9IHsgYW5kOiBbIHF1ZXJ5LndoZXJlLCBxdWVyeU5vbkRlbGV0ZWQgXSB9O1xuICAgIH1cblxuICAgIHJldHVybiBfZmluZC5jYWxsKE1vZGVsLCBxdWVyeSwgLi4ucmVzdCk7XG4gIH07XG5cbiAgY29uc3QgX2NvdW50ID0gTW9kZWwuY291bnQ7XG4gIE1vZGVsLmNvdW50ID0gZnVuY3Rpb24gY291bnREZWxldGVkKHdoZXJlID0ge30sIC4uLnJlc3QpIHtcbiAgICAvLyBCZWNhdXNlIGNvdW50IG9ubHkgcmVjZWl2ZXMgYSAnd2hlcmUnLCB0aGVyZSdzIG5vd2hlcmUgdG8gYXNrIGZvciB0aGUgZGVsZXRlZCBlbnRpdGllcy5cbiAgICBjb25zdCB3aGVyZU5vdERlbGV0ZWQgPSB7IGFuZDogWyB3aGVyZSwgcXVlcnlOb25EZWxldGVkIF0gfTtcbiAgICByZXR1cm4gX2NvdW50LmNhbGwoTW9kZWwsIHdoZXJlTm90RGVsZXRlZCwgLi4ucmVzdCk7XG4gIH07XG5cbiAgY29uc3QgX3VwZGF0ZSA9IE1vZGVsLnVwZGF0ZTtcbiAgTW9kZWwudXBkYXRlID0gTW9kZWwudXBkYXRlQWxsID0gZnVuY3Rpb24gdXBkYXRlRGVsZXRlZCh3aGVyZSA9IHt9LCAuLi5yZXN0KSB7XG4gICAgLy8gQmVjYXVzZSB1cGRhdGUvdXBkYXRlQWxsIG9ubHkgcmVjZWl2ZXMgYSAnd2hlcmUnLCB0aGVyZSdzIG5vd2hlcmUgdG8gYXNrIGZvciB0aGUgZGVsZXRlZCBlbnRpdGllcy5cbiAgICBjb25zdCB3aGVyZU5vdERlbGV0ZWQgPSB7IGFuZDogWyB3aGVyZSwgcXVlcnlOb25EZWxldGVkIF0gfTtcbiAgICByZXR1cm4gX3VwZGF0ZS5jYWxsKE1vZGVsLCB3aGVyZU5vdERlbGV0ZWQsIC4uLnJlc3QpO1xuICB9O1xufTtcbiJdfQ==
