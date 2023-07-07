"use strict";

class Todo {
  constructor({ title, month, year, description }) {
    this.id = this.constructor.getId();
    this.title = title;
    this.completed = false;
    this.month = month;
    this.year = year;
    this.description = description;
  }

  isWithinMonthYear(month, year) {
    if (month === ''  && year === '') {
      return true;
    } else if (month === '') {
      return this.year === year || this.year === '';
    } else if (year === '') {
      return this.month === month || this.month === '';
    } else {
      return (this.month === month || this.month === '') &&
             (this.year === year || this.year === '');
    }
  }

  static id = 0;

  static getId() {
    this.id += 1;
    return this.id;
  }
}

let todoList = (function() {
  let todos = [];

  function getTodoIndex(id) {
    return todos.findIndex(todo => todo.id === id);
  }

  function cloneTodo(todo) {
    return Object.assign(Object.create(Todo.prototype), todo);
  }

  return {
    add(todoData) {
      todos.push(new Todo(todoData));
    },

    delete(id) {
      let index = getTodoIndex(id);

      if (index !== -1) {
        todos.splice(index, 1);
      }
    },

    update(id, updateData) {
      let index = getTodoIndex(id);

      if (index !== -1) {
        let todo = todos[index];
        Object.keys(updateData).forEach(updateProp => {
           if (todo.hasOwnProperty(updateProp) && updateProp !== 'id') {
             todo[updateProp] = updateData[updateProp];
           }
        });
      }
    },

    getTodo(id) {
      let index = getTodoIndex(id);

      if (index !== -1) {
        return cloneTodo(todos[index]);
      }
    },

    allTodos() {
      return todos.map(cloneTodo);
    },

    init(todoSet) {
      todos = todoSet.map(todoData => new Todo(todoData));
    },
  };
})();

let todoManager = {
  init(todoList) {
    this.todoList = todoList;
  },

  query({ completed, month, year }) {
    let result = this.todoList.allTodos();

    if (completed !== undefined) {
      result = result.filter(todo => todo.completed === completed);
    }

    if (month !== undefined) {
      result = result.filter(todo => todo.isWithinMonthYear(month, ''));
    }

    if (year !== undefined) {
      result = result.filter(todo => todo.isWithinMonthYear('', year));
    }

    return result;
  },
};

// Testing begins here

(function() {
  function test(message, assertion, after) {
    let passed;

    try {
      passed = assertion();
    } catch (e) {
      passed = false;
    }

    console.log(message + ': ' + String(!!passed).toUpperCase());

    if (typeof after === 'function') after();
  }

  function sameArray(array1, array2) {
    if (array1.length !== array2.length) return false;

    for (let index = 0; index < array1.length; index += 1) {
      if (array1[index] !== array2[index]) return false;
    }

    return true;
  }

  const todoData1 = {
    title: 'Buy Milk',
    month: '1',
    year: '2017',
    description: 'Milk for baby',
  };

  const todoData2 = {
    title: 'Buy Apples',
    month: '',
    year: '2017',
    description: 'An apple a day keeps the doctor away',
  };

  const todoData3 = {
    title: 'Buy chocolate',
    month: '1',
    year: '',
    description: 'For the cheat day',
  };

  const todoData4 = {
    title: 'Buy Veggies',
    month: '',
    year: '',
    description: 'For the daily fiber needs',
  };

  // todoManager test
  (function() {
    console.log('todoManager tests:');

    const todoData5 = {
      title: 'Swim',
      month: '',
      year: '2017',
      description: 'Good for the mind and body',
    };

    const todoData6 = {
      title: 'JS229',
      month: '4',
      year: '2017',
      description: 'A fun challenge',
    };

    const todoData7 = {
      title: 'Start new job',
      month: '4',
      year: '2017',
      description: 'Lifeguarding',
    };

    const todoData8 = {
      title: 'Meditation',
      month: '',
      year: '',
      description: 'Good for the mind',
    };

    const todoData9 = {
      title: 'Move out',
      month: '4',
      year: '2018',
      description: '',
    };

    const todoData10 = {
      title: 'Keep in touch',
      month: '',
      year: '2018',
      description: 'Sometimes difficult',
    };

    test("todoManager is defined", function() {
      return todoManager !== undefined;
    });

    todoList.init([ todoData1, todoData2, todoData3, todoData4, todoData5,
                    todoData6, todoData7, todoData8, todoData9, todoData10] );
    let ids = todoList.allTodos().map(({ id }) => id);
    ids.forEach(id => {
      if (id % 2 === 1) {
        todoList.update(id, { completed: true });
      }
    });
    todoManager.init(todoList);

    test("Can query for all todos", function() {
      let todos = todoManager.query({});
      return todos.length === 10;
    });

    test("Can query for only complete todos", function() {
      let complete = todoManager.query({ completed: true });
      return complete.length === 5 &&
             complete.every(todo => todo.completed === true);
    });

    test("Can query for only incomplete todos", function() {
      let incomplete = todoManager.query({ completed: false });
      return incomplete.length === 5 &&
             incomplete.every(todo => todo.completed === false);
    });

    test("Can query for todos of a given month", function() {
      let april = todoManager.query({ month: '4' });
      return april.length === 8 &&
             april.every(todo => todo.month === '4' || todo.month === '');
    });

    test("Can query for todos of a given year", function() {
      let seventeen = todoManager.query({ year: '2017' });
      return seventeen.length === 8 &&
             seventeen.every(todo => todo.year === '2017' || todo.year === '');
    });

    test("Can query for todos of a given month and year", function() {
      let query = todoManager.query({ month: '4', year: '2017'});
      return query.length === 6 &&
             query.every(({ month, year }) =>{
               return (month === '4' || month === '') &&
                      (year === '2017' || year === '');
             });
    });

    test("Can query for complete todos of a given month and year", function() {
      let query = todoManager.query({ completed: true, month: '4', year: '2017'});
      return query.length === 2 &&
             query.every(({ completed, month, year }) =>{
               return completed === true &&
                      (month === '4' || month === '') &&
                      (year === '2017' || year === '');
             });
    });

    test("Can query for incomplete todos of a given month and year", function() {
      let query = todoManager.query({ completed: false, month: '4', year: '2017'});
      return query.length === 4 &&
             query.every(({ completed, month, year }) =>{
               return completed === false &&
                      (month === '4' || month === '') &&
                      (year === '2017' || year === '');
             });
    });

    test("Updates to todoList affect todoManager", function() {
      todoList.delete(ids[0]);
      return todoManager.query({}).length === 9;
    })

    console.log('');
  })();

  // todoList tests
  (function() {
    console.log('todoList tests:');

    function after() {
      todoList.init([]);
    }

    after();

    test("todoList is defined", function() {
      return todoList !== undefined;
    });

    test("Can add a todo to the list", function() {
      todoList.add(todoData1);
      let todos = todoList.allTodos();
      return todos.length === 1 &&
             todos[0].title === 'Buy Milk' &&
             todos[0].month === '1' &&
             todos[0].year === '2017' &&
             todos[0].description === 'Milk for baby';
    }, after);

    test("Can delete a todo from the list", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      todoList.delete(id);

      return todoList.allTodos().length === 0;
    }, after);

    test("Can update a todo in the list", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      todoList.update(id, { title: 'New Title',
                            completed: true,
                            month: '4',
                            year: '2023',
                            description: 'New Description'
      });

      let updatedTodo = todoList.allTodos()[0];
      return updatedTodo.id === id &&
             updatedTodo.title === 'New Title' &&
             updatedTodo.completed === true &&
             updatedTodo.month === '4' &&
             updatedTodo.year === '2023' &&
             updatedTodo.description === 'New Description';
    }, after);

    test("Can only update existing properties of a todo", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      todoList.update(id, { title: 'New Title', newProp: 'New Prop'});

      let updatedTodo = todoList.allTodos()[0];
      return updatedTodo.title === 'New Title' &&
             updatedTodo.newProp === undefined;
    }, after);

    test("Cannot update id of a todo", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      todoList.update(id, { id: 999999, title: 'New Title'});

      let updatedTodo = todoList.allTodos()[0];
      return updatedTodo.id === id &&
             updatedTodo.title === 'New Title';
    }, after);

    test("Can retrieve a todo based on its id", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      let todo = todoList.getTodo(id);

      return todo.id === id &&
             todo.title === 'Buy Milk' &&
             todo.completed === false &&
             todo.month === '1' &&
             todo.year === '2017' &&
             todo.description === 'Milk for baby';
    }, after);

    test("Can initialize todoList based on a data set", function() {
      todoList.init([todoData1, todoData2, todoData3, todoData4]);

      let todos = todoList.allTodos();
      return todos.length === 4 &&
             todos[0].title === 'Buy Milk' &&
             todos[1].month === '' &&
             todos[2].year === '' &&
             todos[3].description === 'For the daily fiber needs';
    }, after);

    test("allTodos method returns only copies of todos", function() {
      todoList.add(todoData1);
      let copiedTodo = todoList.allTodos()[0];
      copiedTodo.title = 'New Title';

      return todoList.allTodos()[0].title === 'Buy Milk';
    }, after);

    test("getTodo method returns only a copy of todo", function() {
      todoList.add(todoData1);
      let id = todoList.allTodos()[0].id;
      let copiedTodo = todoList.getTodo(id);
      copiedTodo.title = 'New Title';

      return todoList.getTodo(id).title === 'Buy Milk';
    }, after);

    console.log('');
  })();

  // Todo object tests
  (function() {
    console.log('Todo object tests:');

    const todo1 = new Todo(todoData1);
    const todo2 = new Todo(todoData2);
    const todo3 = new Todo(todoData3);
    const todo4 = new Todo(todoData4);

    test("Todo is defined", function() {
      return typeof Todo === "function";
    });

    test("todo objects have all of and only the required properties", function() {
      const requiredProperties = ['id', 'title', 'completed', 'month', 'year',
                               'description'];

      function checkProperties(todo) {
        let objectKeys = Object.keys(todo);
        return objectKeys.every(key => requiredProperties.includes(key)) &&
               requiredProperties.every(prop => objectKeys.includes(prop));
      }

      return checkProperties(todo1) &&
             checkProperties(todo2) &&
             checkProperties(todo3) &&
             checkProperties(todo4);
    });

    test("todo objects have only one shared method", function() {
      return sameArray(Object.getOwnPropertyNames(Todo.prototype),
                       ['constructor', 'isWithinMonthYear']) &&
             typeof Todo.prototype.isWithinMonthYear === "function";
    });

    test("todo object ids are unique", function() {
      return [todo2.id, todo3.id, todo4.id].every(id => id !== todo1.id) &&
             [todo1.id, todo3.id, todo4.id].every(id => id !== todo2.id) &&
             [todo1.id, todo2.id, todo4.id].every(id => id !== todo3.id) &&
             [todo1.id, todo2.id, todo3.id].every(id => id !== todo4.id);
    });

    test("property values of todo objects are set as expected", function() {
      return todo1.title === 'Buy Milk' &&
             todo1.completed === false &&
             todo1.month === '1' &&
             todo1.year === '2017' &&
             todo1.description === 'Milk for baby';
    });

    test("isWithinMonthYear works as expected when todo has full date", function() {
      return todo1.isWithinMonthYear('1', '2017') === true &&
             todo1.isWithinMonthYear('6', '2018') === false &&
             todo1.isWithinMonthYear('12', '2016') === false &&
             todo1.isWithinMonthYear('2', '2017') === false &&
             todo1.isWithinMonthYear('100', '999') === false;
    });

    test("isWithinMonthYear works as expected when todo has only year", function() {
      return todo2.isWithinMonthYear('1', '2017') === true &&
             todo2.isWithinMonthYear('5', '2017') === true &&
             todo2.isWithinMonthYear('12', '2017') === true &&
             todo2.isWithinMonthYear('3', '2018') === false &&
             todo2.isWithinMonthYear('7', '2016') === false &&
             todo2.isWithinMonthYear('1', '999') === false;
    });

    test("isWithinMonthYear works as expected when todo has only month", function() {
      return todo3.isWithinMonthYear('1', '2016') === true &&
             todo3.isWithinMonthYear('1', '2017') === true &&
             todo3.isWithinMonthYear('1', '2018') === true &&
             todo3.isWithinMonthYear('1', '999') === true &&
             todo3.isWithinMonthYear('2', '2016') === false &&
             todo3.isWithinMonthYear('4', '2018') === false &&
             todo3.isWithinMonthYear('6', '2017') === false;
    });

    test("isWithinMonthYear works as expected when empty string is passed as month argument", function() {
      return todo1.isWithinMonthYear('', '2017') === true &&
             todo2.isWithinMonthYear('', '2017') === true &&
             todo3.isWithinMonthYear('', '2019') === true &&
             todo4.isWithinMonthYear('', '2020') === true &&
             todo1.isWithinMonthYear('', '999') === false;
    });

    test("isWithinMonthYear works as expected when empty string is passed as year argument", function() {
      return todo1.isWithinMonthYear('1', '') === true &&
             todo2.isWithinMonthYear('5', '') === true &&
             todo3.isWithinMonthYear('1', '') === true &&
             todo4.isWithinMonthYear('3', '') === true &&
             todo1.isWithinMonthYear('13', '') === false;
    });

    console.log('');
  })();
})();
