using System.Web;
using System.Web.Mvc;

namespace SJKP.OutlookAppoinmentPlannerBackend
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
