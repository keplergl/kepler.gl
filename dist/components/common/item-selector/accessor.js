'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Accessor = {
  IDENTITY_FN: function IDENTITY_FN(input) {
    return input;
  },

  generateAccessor: function generateAccessor(field) {
    return function (object) {
      return object[field];
    };
  },

  generateOptionToStringFor: function generateOptionToStringFor(prop) {
    if (typeof prop === 'string') {
      return this.generateAccessor(prop);
    } else if (typeof prop === 'function') {
      return prop;
    }
    return this.IDENTITY_FN;
  },

  valueForOption: function valueForOption(option, object) {
    if (typeof option === 'string') {
      return object[option];
    } else if (typeof option === 'function') {
      return option(object);
    }
    return object;
  }
};

exports.default = Accessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2FjY2Vzc29yLmpzIl0sIm5hbWVzIjpbIkFjY2Vzc29yIiwiSURFTlRJVFlfRk4iLCJpbnB1dCIsImdlbmVyYXRlQWNjZXNzb3IiLCJvYmplY3QiLCJmaWVsZCIsImdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IiLCJwcm9wIiwidmFsdWVGb3JPcHRpb24iLCJvcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTUEsV0FBVztBQUNmQyxlQUFhO0FBQUEsV0FBU0MsS0FBVDtBQUFBLEdBREU7O0FBR2ZDLG9CQUFrQjtBQUFBLFdBQVM7QUFBQSxhQUFVQyxPQUFPQyxLQUFQLENBQVY7QUFBQSxLQUFUO0FBQUEsR0FISDs7QUFLZkMsNkJBQTJCLFNBQVNBLHlCQUFULENBQW1DQyxJQUFuQyxFQUF5QztBQUNsRSxRQUFJLE9BQU9BLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsYUFBTyxLQUFLSixnQkFBTCxDQUFzQkksSUFBdEIsQ0FBUDtBQUNELEtBRkQsTUFFTyxJQUFJLE9BQU9BLElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDckMsYUFBT0EsSUFBUDtBQUNEO0FBQ0QsV0FBTyxLQUFLTixXQUFaO0FBQ0QsR0FaYzs7QUFjZk8sa0JBQWdCLHdCQUFDQyxNQUFELEVBQVNMLE1BQVQsRUFBb0I7QUFDbEMsUUFBSSxPQUFPSyxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLGFBQU9MLE9BQU9LLE1BQVAsQ0FBUDtBQUNELEtBRkQsTUFFTyxJQUFJLE9BQU9BLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDdkMsYUFBT0EsT0FBT0wsTUFBUCxDQUFQO0FBQ0Q7QUFDRCxXQUFPQSxNQUFQO0FBQ0Q7QUFyQmMsQ0FBakI7O2tCQXdCZUosUSIsImZpbGUiOiJhY2Nlc3Nvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFjY2Vzc29yID0ge1xuICBJREVOVElUWV9GTjogaW5wdXQgPT4gaW5wdXQsXG5cbiAgZ2VuZXJhdGVBY2Nlc3NvcjogZmllbGQgPT4gb2JqZWN0ID0+IG9iamVjdFtmaWVsZF0sXG5cbiAgZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcjogZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0Zvcihwcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVBY2Nlc3Nvcihwcm9wKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcHJvcDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuSURFTlRJVFlfRk47XG4gIH0sXG5cbiAgdmFsdWVGb3JPcHRpb246IChvcHRpb24sIG9iamVjdCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG9iamVjdFtvcHRpb25dO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9wdGlvbihvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY2Nlc3NvcjtcbiJdfQ==