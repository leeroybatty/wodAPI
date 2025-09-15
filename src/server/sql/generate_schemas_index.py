# This file exists to create a config file to compare against in the build process
# the later goal is to provide a script that checks if the database matches the schema described by this generation script.

import json
import re
import os

index_file_path = './schemas_index.json'
output_file_path = './tables.json'

def extract_table_and_column_info(sql_file_content):

    table_pattern = re.compile(r'CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)', re.IGNORECASE)
    column_pattern = re.compile(r'^\s*(\w+)\s+(\w+.*?)(?:,|\s|$)', re.IGNORECASE)
    foreign_key_pattern = re.compile(r'REFERENCES\s+(\w+)\s*\((\w+)\)(?:\s+ON\s+DELETE\s+(CASCADE|RESTRICT|SET\s+NULL|NO\s+ACTION))?', re.IGNORECASE)

    tables = {}
    current_table = None

    lines = sql_file_content.splitlines()

    for line in lines:
        table_match = table_pattern.search(line)
        if table_match:
            current_table = table_match.group(1)
            tables[current_table] = []
            continue

        if current_table and re.match(r'\s+\w+\s+', line):
            trimmed_line = line.strip()
            column_match = column_pattern.match(trimmed_line)
            if column_match:
                column_name = column_match.group(1)
                column_type = column_match.group(2)
                column_data = {"name": column_name, "type": column_type}
                foreign_key_match = foreign_key_pattern.search(trimmed_line)
                if foreign_key_match:
                    column_data["foreign_key"] = { "referenced_table": foreign_key_match.group(1), "referenced_column": foreign_key_match.group(2) }
                    on_delete = foreign_key_match.group(3)
                    if on_delete:
                      column_data["foreign_key"]["on_delete"] = on_delete 
                tables[current_table].append(column_data)

        if current_table and line.strip() == ");":
            current_table = None

    return tables

def main():
    if not os.path.exists(index_file_path):
        print(f"Index file '{index_file_path}' does not exist.")
        return

    with open(index_file_path, 'r') as index_file:
        schema_files = json.load(index_file)

    tables_dict = {}

    for schema_file in schema_files:
        if not os.path.isfile(schema_file):
            print(f"Schema file '{schema_file}' does not exist.")
            continue

        with open(schema_file, 'r') as file:
            sql_content = file.read()

        table_info = extract_table_and_column_info(sql_content)

        for table_name, columns in table_info.items():
            tables_dict[table_name] = {
                "name": table_name,
                "file": schema_file,
                "columns": columns
            }

    with open(output_file_path, 'w') as output_file:
        json.dump(tables_dict, output_file, indent=2)

    print(f"Configuration file generated at '{output_file_path}'")

if __name__ == "__main__":
    main()