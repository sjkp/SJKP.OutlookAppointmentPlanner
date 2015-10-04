using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class TableRepository<T> where T : class, IId, new()
    {
         protected CloudTable table;
         public TableRepository(string tableName)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["CloudStorageAccount"]);
            var client = storageAccount.CreateCloudTableClient();
            table = client.GetTableReference(tableName);
            table.CreateIfNotExists();
        }

        public virtual IEnumerable<T> SelectMany()
        {
            TableQuery<TableData<T>> query = new TableQuery<TableData<T>>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, typeof(ScheduledAppointment).Name));
            return table.ExecuteQuery(query).Select(s => s.Entity);
        }

        public virtual TableData<T> GetFirstOrDefault(string id)
        {
            TableQuery<TableData<T>> query = new TableQuery<TableData<T>>().Where(
                TableQuery.CombineFilters(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, typeof(T).Name), 
                TableOperators.And, TableQuery.GenerateFilterCondition("RowKey",QueryComparisons.Equal,id)));
            return table.ExecuteQuery(query).FirstOrDefault();
        }

        public virtual async Task Delete(string id)
        {
            await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Delete(new TableData<T>(new T() {Id = id})));
        }

        public virtual async Task<TableResult> InsertAsync(T value)
        {
            return await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Insert(new TableData<T>(value)));
        }

        public virtual async Task<TableResult> ReplaceAsync(TableData<T> existing, T value)
        {
            existing.Data = new TableData<T>(value).Data;
            TableOperation operation = Microsoft.WindowsAzure.Storage.Table.TableOperation.Replace(existing);

            return await table.ExecuteAsync(operation);
        }
    }
}
