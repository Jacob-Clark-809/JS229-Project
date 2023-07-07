JS229 Project - TodoList

Assumptions:
- There is no need to validate any input values. The program will always be used
  as intended.
- Empty month and year columns match all months or years. E.g. A todo with
  month: '', year: '2017' returns true when we call todo.isWithinMonthYear(month,
  '2017') for all values of month. Similarly for empty year values.
  This also works in reverse, i.e. when we call isWithinMonthYear and pass in
  an empty string as a parameter then the method will return true for all todos
  regardless of their month or year value (depending on which of month or year
  is passed in as an empty string).
- When updating a todo the update data will be passed in as key value pairs.

todoManager: The query method of this object expects input of the form -
{ completed: (true|false), month: '...', year: '...' } with any or all of these
properties omitted. If you wish to perform no queries and return all todos in
the list you must still pass in some type of object, an empty object will do { }.
As always we assume that the correct value types are passed along and there is no
need for validation.
