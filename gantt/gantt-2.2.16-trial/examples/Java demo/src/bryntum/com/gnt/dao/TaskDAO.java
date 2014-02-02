package bryntum.com.gnt.dao;

import java.util.List;

import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Repository;

import bryntum.com.gnt.model.Task;

@Repository
public class TaskDAO {
	
	private HibernateTemplate hibernateTemplate;

	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		hibernateTemplate = new HibernateTemplate(sessionFactory);
	}
	
	/**
	 * Get List of tasks from database
	 * @return list of all tasks
	 */
	@SuppressWarnings("unchecked")
	public List<Task> getTasks() {
		
		DetachedCriteria criteria = DetachedCriteria.forClass(Task.class);

		return hibernateTemplate.findByCriteria(criteria);
	}

	/**
	 * Delete a task with the id passed as parameter
	 * @param id
	 */
	public void deleteTask(int id){
		Object record = hibernateTemplate.load(Task.class, id);
		hibernateTemplate.delete(record);
	}
	
	/**
	 * Create a new Task on the database or
	 * Update Task
	 * @param task
	 * @return task added or updated in DB
	 */
	public Task saveTask(Task record){
		hibernateTemplate.saveOrUpdate(record);
		return record;
	}
}