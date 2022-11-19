namespace WebApiCore.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Core.Objects;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    
     partial class WebApiDataEntities : DbContext
    {

        public override int SaveChanges()
        {

            AddBaseInfomation();
            return base.SaveChanges();
        }
        public override Task<int> SaveChangesAsync()
        {

            AddBaseInfomation();
            return base.SaveChangesAsync();
        }
        public void AddBaseInfomation()
        {

            var entities = ChangeTracker.Entries().Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified || x.State == EntityState.Deleted));

            var currentUsername = !string.IsNullOrEmpty(System.Web.HttpContext.Current?.User?.Identity?.Name)
                ? System.Web.HttpContext.Current.User.Identity.Name
                : "Anonymous";

            foreach (var entity in entities)
            {
                if (entity.State != EntityState.Deleted)
                {
                    if (entity.CurrentValues.PropertyNames.Contains("UpdatedAt"))
                        entity.Property("UpdatedAt").CurrentValue = DateTime.Now;
                    if (entity.CurrentValues.PropertyNames.Contains("UpdatedBy"))
                        entity.Property("UpdatedBy").CurrentValue = currentUsername;
                }
                if (entity.State == EntityState.Added)
                {
                    if (entity.CurrentValues.PropertyNames.Contains("FInUse"))
                        entity.Property("FInUse").CurrentValue = true;
                    if (entity.CurrentValues.PropertyNames.Contains("CreatedAt"))
                        entity.Property("CreatedAt").CurrentValue = DateTime.Now;
                    if (entity.CurrentValues.PropertyNames.Contains("CreatedBy"))
                        entity.Property("CreatedBy").CurrentValue = currentUsername;
                }

                // HandleUserLog(entity, currentUsername);


            }
        }
        private object GetPrimaryKeyValue(DbEntityEntry entry)
        {
            var objectStateEntry = ((IObjectContextAdapter)this).ObjectContext.ObjectStateManager.GetObjectStateEntry(entry.Entity);
            object o = objectStateEntry.EntityKey.EntityKeyValues[0].Value;
            return o;
        }
        private bool inExcludeList(string prop)
        {
            string[] excludeList = { "props", "to", "exclude" };
            return excludeList.Any(s => s.Equals(prop));
        }
        public void HandleUserLog(DbEntityEntry entity, string currentUsername)
        {
            var entityName = ObjectContext.GetObjectType(entity.Entity.GetType()).Name;

            string Thaotac = "";
            WebApiDataEntities db = new WebApiDataEntities();
            if (entity.State == EntityState.Added) Thaotac = "Thêm mới";
            else if (entity.State == EntityState.Modified) Thaotac = "Cập nhật";
            else Thaotac = "Xóa";

            if (entityName != "NhatKySuDung" && currentUsername != "Anonymous"
                        && (entityName == "tblDoiTuong_HoSo" || entityName == "Hosomuon" || entityName == "Phieumuonhoso"))
            {
                if (entity.State == EntityState.Modified)
                {
                    var primaryKey = GetPrimaryKeyValue(entity);
                    var DatabaseValues = entity.GetDatabaseValues();

                    foreach (var prop in entity.OriginalValues.PropertyNames)
                    {
                        if (inExcludeList(prop))
                        {
                            continue;
                        }

                        string originalValue = DatabaseValues.GetValue<object>(prop)?.ToString();
                        string currentValue = entity.CurrentValues[prop]?.ToString();

                        if (prop == "Id" || prop == "id" || prop == "ID" || prop == "iD")
                            Thaotac += " bản ghi có Id = " + primaryKey + "</br>";

                        if (originalValue != currentValue)
                        {
                            Thaotac += "- " + prop + ": " + originalValue + " => " + currentValue + "</br>";
                        }

                    }

                }

                Commons.Common.CreateUserLog(db, entity.Entity.GetType().Name, Thaotac, currentUsername);

            }
        }

    }
}