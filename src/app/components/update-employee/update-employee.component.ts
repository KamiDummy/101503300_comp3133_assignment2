import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-update-employee',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string = '';
  photoBase64: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (result) => {
        const emp = result.data.searchEmployeeById;
        this.employeeForm.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender,
          designation: emp.designation,
          salary: emp.salary,
          date_of_joining: emp.date_of_joining ? emp.date_of_joining.split('T')[0] : '',
          department: emp.department
        });
      },
      error: (error) => {
        console.log('Error loading employee:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const updateData: any = {
      ...this.employeeForm.value,
      salary: parseFloat(this.employeeForm.value.salary)
    };

    if (this.photoBase64) {
      updateData.employee_photo = this.photoBase64;
    }

    this.employeeService.updateEmployee(this.employeeId, updateData).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.log('Error updating employee:', error);
      }
    });
  }
}
