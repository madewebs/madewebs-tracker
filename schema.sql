-- Drop existing tables if they exist
drop table if exists employee_updates;
drop table if exists project_checklists;
drop table if exists projects;

-- Projects Table
create table projects (
    id uuid default gen_random_uuid() primary key,
    company_name text not null,
    contact_person text,
    phone text,
    email text,
    website text,
    plan text,
    assigned_to text,
    deadline date,
    status text default 'Requirements',
    
    -- Financials
    project_value numeric default 0,
    advance_received numeric default 0,
    final_payment_received numeric default 0,
    salary_expense numeric default 0,
    domain_cost numeric default 0,
    hosting_cost numeric default 0,
    other_expenses numeric default 0,
    
    -- Domain Info
    domain_name text,
    renewal_date date,
    client_email text,
    
    -- Links
    github_url text,
    preview_url text,
    live_url text,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project Checklists Table
create table project_checklists (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade,
    category text not null, -- 'Requirements', 'Development', 'Testing', 'Deployment'
    task_name text not null,
    completed boolean default false,
    completed_at timestamp with time zone,
    
    unique(project_id, category, task_name)
);

-- Employee Updates Table
create table employee_updates (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade,
    employee_name text,
    note text,
    screenshot_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a trigger function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Create triggers for projects table
create trigger update_projects_updated_at
    before update on projects
    for each row
    execute function update_updated_at_column();

-- Disable Row Level Security (RLS) since we use a custom auth system
alter table projects disable row level security;
alter table project_checklists disable row level security;
alter table employee_updates disable row level security;
