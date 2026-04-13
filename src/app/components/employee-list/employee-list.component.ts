import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchType: string = 'department';
  searchText: string = '';

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (result) => {
        this.employees = result.data.getAllEmployees;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error loading employees:', error);
      }
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.log('Error deleting employee:', error);
        }
      });
    }
  }

  search() {
    if (!this.searchText.trim()) {
      this.loadEmployees();
      return;
    }

    const designation = this.searchType === 'designation' ? this.searchText : '';
    const department = this.searchType === 'department' ? this.searchText : '';

    this.employeeService.searchEmployees(designation, department).subscribe({
      next: (result) => {
        this.employees = result.data.searchEmployeeByDesignationOrDepartment;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error searching employees:', error);
      }
    });
  }

  clearSearch() {
    this.searchText = '';
    this.loadEmployees();
  }
}
