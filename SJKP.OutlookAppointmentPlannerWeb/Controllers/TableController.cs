using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SJKP.OutlookAppoinmentPlannerBackend.Controllers
{
    public class TableController<T> : ApiController where T : class, IId, new()
    {
        protected CloudTable table;
        public TableController(string tableName)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["CloudStorageAccount"]);
            var client = storageAccount.CreateCloudTableClient();
            table = client.GetTableReference(tableName);
            table.CreateIfNotExists();
        }

        protected virtual IEnumerable<T> SelectMany()
        {
            TableQuery<TableData<T>> query = new TableQuery<TableData<T>>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, typeof(ScheduledAppointment).Name));
            return table.ExecuteQuery(query).Select(s => s.Entity);
        }

        protected virtual TableData<T> GetFirstOrDefault(Guid id)
        {
            TableQuery<TableData<T>> query = new TableQuery<TableData<T>>().Where(
                TableQuery.CombineFilters(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, typeof(T).Name), 
                TableOperators.And, TableQuery.GenerateFilterCondition("RowKey",QueryComparisons.Equal,id.ToString())));
            return table.ExecuteQuery(query).FirstOrDefault();
        }

        public virtual async Task Delete(Guid id)
        {
            await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Delete(new TableData<T>(new T() {Id = id})));
        }
    }
}