import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { SalaryPipe } from '../../pipes/salary.pipe';

@Component({
  selector: 'app-employee-details',
  imports: [SalaryPipe],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(id).subscribe({
      next: (result) => {
        this.employee = result.data.searchEmployeeById;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.cdr.detectChanges();
        console.log('Error loading employee:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}
