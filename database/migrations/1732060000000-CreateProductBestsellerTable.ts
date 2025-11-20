import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductBestsellerTable1732060000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create product_bestseller table
    await queryRunner.createTable(
      new Table({
        name: 'product_bestseller',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_pinned',
            type: 'boolean',
            default: false,
          },
          {
            name: 'custom_priority',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'total_sales',
            type: 'int',
            default: 0,
          },
          {
            name: 'sales_last_30_days',
            type: 'int',
            default: 0,
          },
          {
            name: 'revenue_generated',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign key to product table
    await queryRunner.createForeignKey(
      'product_bestseller',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );

    // Add unique index on product_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_product_bestseller_product_id ON product_bestseller(product_id)`,
    );

    // Add index for querying active bestsellers
    await queryRunner.query(
      `CREATE INDEX idx_product_bestseller_active ON product_bestseller(is_active, is_pinned)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_bestseller');
  }
}
