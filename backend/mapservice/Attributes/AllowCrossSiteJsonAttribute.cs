﻿using System.Web.Mvc;

namespace MapService.Attributes
{
    public class CORSActionFilter : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Headers", "*");
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Credentials", "true");

            if (filterContext.HttpContext.Request.HttpMethod == "OPTIONS")
			{				
				filterContext.Result = new EmptyResult();
			}
			else
			{
				base.OnActionExecuting(filterContext);
			}
		}
	}
}