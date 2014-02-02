package bryntum.com.gnt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bryntum.com.gnt.dao.TaskDAO;
import bryntum.com.gnt.model.Task;

@Service
public class TaskService {
	
	private TaskDAO taskDAO;

	/**
	 * Get all tasks
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<Task> getTasksList(){
		
		return taskDAO.getTasks();
	}
	
	/**
	 * Create new Task/Tasks
	 * @param data - json data from request
	 * @return created tasks
	 */
	@Transactional
	public List<Task> create(Task record){
		
        List<Task> newTasks = new ArrayList<Task>();
		
		newTasks.add(taskDAO.saveTask(record));
		
		return newTasks;
	}
	
	
	/**
	 * Update task/tasks
	 * @param data - json data from request
	 * @return updated tasks
	 */
	@Transactional
	public List<Task> update(Task record){
		
		List<Task> returnTasks = new ArrayList<Task>();
		
		returnTasks.add(taskDAO.saveTask(record));
		
		return returnTasks;
	}
	
	/**
	 * Delete task/tasks
	 * @param task - json data from request
	 */
	@Transactional
	public void delete(Task record){
		
		taskDAO.deleteTask(record.getId());
	}

	/**
	 * Spring use - DI
	 * @param taskDAO
	 */
	@Autowired
	public void setTaskDAO(TaskDAO taskDAO) {
		this.taskDAO = taskDAO;
	}
}