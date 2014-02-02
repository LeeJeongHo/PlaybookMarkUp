/**
 * Class preparing CRUD views for the application, mapping each view to request url.
 */

package bryntum.com.gnt.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import org.json.*;

import bryntum.com.gnt.model.Task;
import bryntum.com.gnt.model.TaskWrapper;
import bryntum.com.gnt.service.TaskService;
import bryntum.com.gnt.util.ReturnTasks;

@Controller
public class TaskController  {

	private TaskService taskService;
	
	@RequestMapping(value="/tasks/view.action")
	public @ResponseBody String view() throws Exception {

		try{
			List<Task> tasks = taskService.getTasksList();

			return ReturnTasks.mapOK(tasks);
		} catch (Exception e) {
			return ReturnTasks.mapError("Error retrieving Tasks from the database.");
		}
	}
	
	@RequestMapping(value="/tasks/create.action")
	public @ResponseBody String create(@RequestBody TaskWrapper data) throws Exception {

		try{
			List<Task> tasks = taskService.create(data.getData());

			return ReturnTasks.mapOK(tasks);

		} catch (Exception e) {
			return ReturnTasks.mapError("Error trying to create task. ");
		}
	}
	
	@RequestMapping(value="/tasks/update.action")
	public @ResponseBody String update(@RequestBody TaskWrapper data) throws Exception {
		try{
			List<Task> tasks = taskService.update(data.getData());

			return ReturnTasks.mapOK(tasks);
		} catch (Exception e) {
			return ReturnTasks.mapError("Error trying to update task. ");
		}
	}
	
	@RequestMapping(value="/tasks/delete.action")
	public @ResponseBody String delete(@RequestBody TaskWrapper data) throws Exception {
		
		try{
			JSONObject ret = new JSONObject();
			taskService.delete(data.getData());

			ret.put("success", true);

			return ret.toString();
		} catch (Exception e) {
			return ReturnTasks.mapError("Error trying to delete task. ");
		}
	}
	
	@Autowired
	public void setEventService(TaskService taskService) {
		this.taskService = taskService;
	}
}