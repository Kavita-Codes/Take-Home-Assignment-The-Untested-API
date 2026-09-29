# Bug Report

## Bug 1: Pagination skips first page

### Expected behavior
When requesting page 1 with a limit of 2, the API should return the first 2 tasks.

### Actual behavior
The first 2 tasks were skipped and the API returned tasks from the second page.

### How it was discovered
An automated unit test for getPaginated() failed.

### Root cause
The offset was calculated as:

const offset = page * limit;

For page 1, this starts at index 2 instead of index 0.

### Fix
Changed the calculation to:

const offset = (page - 1) * limit;

## Bug 2: Completing a task changes priority

### Expected behavior
Completing a task should change its status to done without changing its priority.

### Actual behavior
A high-priority task became medium priority after completion.

### How it was discovered
A unit test checked that priority remained unchanged after completing a task.

### Root cause
completeTask() explicitly set priority to medium.

### Fix
Removed the priority modification from completeTask().

## Bug 3: Status filter matches partial strings

### Expected behavior
Filtering by a status should return only tasks with that exact status.

### Actual behavior
The service used includes(), which allowed partial matches.

### How it was discovered
A unit test passed a partial status value and received matching tasks.

### Root cause
The filter used:

t.status.includes(status)

### Fix
Changed it to exact comparison:

t.status === status