const Boom = require('boom');
const db = require(__base + 'db');

// Database query function
// const getAllTasksByJobId = (exports.getAllTasksByJobId = async id => {
//   try {
//     let res = await db.query(
//       `select * from ${db.TABLES.Task} where experiment_id = $1`,
//       [id]
//     );
//     return res.rows;
//   } catch (error) {
//     console.error(error);
//     throw Boom.badImplementation('Error while trying to fetch the record');
//   }
// });

//test function
const getAllTasksByJobId = (exports.getAllTasksByJobId = async id => {
  if(parseInt(id, 10)<1 || parseInt(id, 10)>7) {
    return (tasks = {
      tasks: {
        task1: { total_time: 10.00, item_id: 1, criteria_id: 1, answer: 'yes' },
        task2: { total_time: 12.32, item_id: 2, criteria_id: 1, answer: 'no' }
      }
    })
  } else {
  switch (parseInt(id, 10)) {
    case 1:
      return (tasks = {
        tasks: {
          task1: { total_time: 2.21, item_id: 1, criteria_id: 1, answer: 'yes' },
          task2: { total_time: 3.45, item_id: 2, criteria_id: 1, answer: 'no' },
          task3: { total_time: 4.65, item_id: 3, criteria_id: 1, answer: 'yes' },
          task4: { total_time: 5.6, item_id: 4, criteria_id: 1, answer: 'yes' },
          task5: { total_time: 9.6, item_id: 5, criteria_id: 1, answer: 'no' },
          task6: { total_time: 8.6, item_id: 1, criteria_id: 2, answer: 'yes' },
          task7: { total_time: 2.6, item_id: 2, criteria_id: 2, answer: 'yes' },
          task8: { total_time: 3.6, item_id: 3, criteria_id: 2, answer: 'no' },
          task9: { total_time: 4.6, item_id: 4, criteria_id: 2, answer: 'idk' },
          task10: { total_time: 8.6, item_id: 5, criteria_id: 2, answer: 'yes' },
          task11: { total_time: 7.6, item_id: 1, criteria_id: 3, answer: 'no' }
        }
      });
      break;
    case 2:
      return (tasks = {
        tasks: {
          task1: { total_time: 16.21, item_id: 1, criteria_id: 1, answer: 'yes' },
          task2: { total_time: 54.45, item_id: 2, criteria_id: 1, answer: 'idk' },
          task3: { total_time: 21.65, item_id: 3, criteria_id: 1, answer: 'yes' },
          task4: { total_time: 43.6, item_id: 1, criteria_id: 2, answer: 'no' },
          task5: { total_time: 12.6, item_id: 3, criteria_id: 2, answer: 'yes' },
          task6: { total_time: 32.6, item_id: 4, criteria_id: 2, answer: 'yes' },
          task7: { total_time: 12.6, item_id: 5, criteria_id: 2, answer: 'yes' },
          task8: { total_time: 43.6, item_id: 4, criteria_id: 3, answer: 'no' },
          task9: { total_time: 22.6, item_id: 5, criteria_id: 3, answer: 'no' },
          task10: { total_time: 54.6, item_id: 1, criteria_id: 3, answer: 'yes' },
          task11: { total_time: 43.6, item_id: 2, criteria_id: 3, answer: 'idk' }
        }
      });
      break;
    case 3:
      return (tasks = {
        tasks: {
          task1: { total_time: 17.24, item_id: 2, criteria_id: 1, answer: 'yes' },
          task2: { total_time: 44.45, item_id: 3, criteria_id: 1, answer: 'yes' },
          task3: { total_time: 21.65, item_id: 4, criteria_id: 1, answer: 'yes' },
          task4: { total_time: 43.0, item_id: 5, criteria_id: 1, answer: 'yes' },
          task5: { total_time: 12.65, item_id: 2, criteria_id: 2, answer: 'yes' },
          task6: { total_time: 32.6, item_id: 2, criteria_id: 3, answer: 'yes' },
          task7: { total_time: 12.66, item_id: 3, criteria_id: 3, answer: 'yes' },
          task8: { total_time: 23.6, item_id: 4, criteria_id: 3, answer: 'yes' },
          task9: { total_time: 75.560, item_id: 5, criteria_id: 3, answer: 'yes' },
          task10: { total_time: 34.8, item_id: 1, criteria_id: 3, answer: 'no' }
        }
      });
      break;
    case 5:
      return (tasks = {
        tasks : {
          task1: { total_time: 16, item_id: 1, criteria_id: 3, answer: 'yes' },
          task11: { total_time: 43.6, item_id: 2, criteria_id: 2, answer: 'idk' }
        }
      })
      break;
    default:
      return (
        tasks = {
          tasks: {
          }
        });
      break;
    }
  }
});

const getAllWorkersByJobId = (exports.getAllWorkersByJobId = async id => {
  if(parseInt(id, 10)<3 || parseInt(id, 10)>7) {
    return(workers = {
      workers: {
        worker1: { worker_id: 22, worker_name: 'Mattia Pavan'}
      }
    })
  } else {
    switch(parseInt(id, 10)) {
      case 3:
        return(workers = {
          workers: {
            worker1: { worker_id: 1, worker_name: 'Jorge Ramirez'},
            worker2: { worker_id: 2, worker_name: 'Niccolò Bellucco'},
            worker3: { worker_id: 3, worker_name: 'Davide Sugoi'},
            worker4: { worker_id: 22, worker_name: 'Mattia Pavan'},
            worker5: { worker_id: 10, worker_name: 'Mladjan Gioresky'}
          }
        })
        break;
      case 4:
        return(workers = {
          workers: {
            worker1: { worker_id: 3, worker_name: 'Davide Sugoi'},
            worker2: { worker_id: 1, worker_name: 'Jorge Ramirez'}
          }
        })
        break;
      case 5:
        return(workers = {
          workers: {
            worker1: { worker_id: 10, worker_name: 'Mladjan Gioresky'},
            worker2: { worker_id: 1, worker_name: 'Jorge Ramirez'},
            worker3: { worker_id: 2, worker_name: 'Niccolò Bellucco'}
          }
        })
        break;
      default: 
        return(workers = {
          workers: {
            worker1: { worker_id: 3, worker_name: 'Davide Sugoi'},
            worker2: { worker_id: 1, worker_name: 'Jorge Ramirez'}
          }
        })
        break;
    }
  }
});

const getWorkerTimes = (exports.getWorkerTimes = async id => {
if(parseInt(id, 10)>4) {
  return(tasks = {
    tasks: {
      task5: { total_time: 12.65, task_id: 50, item_id: 1, criteria_id: 1, answer: 'yes' },
      task6: { total_time: 32.6, task_id: 90, item_id: 1, criteria_id: 2, answer: 'no' }
    }
  })
} else {
  switch(parseInt(id, 10)) {
    case 1:
      return(tasks = {
        tasks: {
          task1: { total_time: 2.21, task_id: 1, item_id: 1, criteria_id: 1, answer: 'yes' },
          task2: { total_time: 3.45, task_id: 3, item_id: 2, criteria_id: 2, answer: 'yes' },
          task3: { total_time: 4.65, task_id: 7, item_id: 3, criteria_id: 2, answer: 'idk' }
        }
      })
      break;
    case 2:
      return(tasks = {
        tasks: {
          task4: { total_time: 5.6, task_id: 2, item_id: 1, criteria_id: 2, answer: 'yes' },
          task5: { total_time: 9.6, task_id: 5, item_id: 1, criteria_id: 3, answer: 'no' },
          task6: { total_time: 8.6, task_id: 9, item_id: 1, criteria_id: 1, answer: 'no' },
        }
      })
      break;
    case 3:
      return(tasks = {
        tasks: {
          task8: { total_time: 3.6, task_id: 32, item_id: 3, criteria_id: 1, answer: 'yes' },
          task9: { total_time: 4.6, task_id: 27, item_id: 3, criteria_id: 2, answer: 'yes' },
          task10: { total_time: 8.6, task_id: 21, item_id: 3, criteria_id: 3, answer: 'idk' },
          task11: { total_time: 7.6, task_id: 22, item_id: 4, criteria_id: 1, answer: 'idk' }
        }
      })
      break;
    case 4:
      return(tasks = {
        tasks: {
          tasks: {
            task1: { total_time: 16.21, task_id: 1, item_id: 1, criteria_id: 1, answer: 'yes' },
            task2: { total_time: 54.45, task_id: 3, item_id: 1, criteria_id: 2, answer: 'no' },
            task3: { total_time: 21.65, task_id: 7, item_id: 3, criteria_id: 2, answer: 'yes' },
            task4: { total_time: 43.6, task_id: 2, item_id: 4, criteria_id: 2, answer: 'idk' },
            task5: { total_time: 12.6, task_id: 5, item_id: 5, criteria_id: 3, answer: 'yes' }
          }
        }
      })
      break;
    default: 
      return(tasks = {
        tasks: {
        }
      })
      break;
  }
}
});