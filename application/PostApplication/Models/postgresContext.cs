using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PostApplication.Models
{
    public partial class PostgresContext : DbContext
    {
        public PostgresContext()
        {
        }

        public PostgresContext(DbContextOptions<PostgresContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TPostApplication> TPostApplication { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseNpgsql("User ID=postgres;Password=;Host=localhost;Port=32768;Database=postgres;Pooling=true;");
//            }
//        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TPostApplication>(entity =>
            {
                entity.HasKey(e => e.ApplicationNo);

                entity.ToTable("T_POST_APPLICATION");

                entity.Property(e => e.ApplicationNo)
                    .HasMaxLength(10)
                    .HasDefaultValueSql("nextval('application_no_seq'::regclass)");

                entity.Property(e => e.ApplyDate).HasColumnType("timestamp with time zone");

                entity.Property(e => e.CloseDate).HasColumnType("timestamp with time zone");

                entity.Property(e => e.DemandNo).HasMaxLength(10);

                entity.Property(e => e.RegisterDate).HasColumnType("timestamp with time zone");

                entity.Property(e => e.RegisterUser).HasMaxLength(10);

                entity.Property(e => e.ResourceNo).HasMaxLength(10);

                entity.Property(e => e.Status).HasMaxLength(2);

                entity.Property(e => e.UpdateDate).HasColumnType("timestamp with time zone");

                entity.Property(e => e.UpdateUser).HasMaxLength(10);
            });

            modelBuilder.HasSequence("application_no_seq")
                .HasMin(1000)
                .HasMax(99999999999)
                .IsCyclic();
        }
    }
}
