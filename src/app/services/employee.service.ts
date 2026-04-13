import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const GET_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeById($eid: ID!) {
    searchEmployeeById(eid: $eid) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $gender: String!,
    $designation: String!,
    $salary: Float!,
    $date_of_joining: String!,
    $department: String!,
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining,
      department: $department,
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $eid: ID!,
    $first_name: String,
    $last_name: String,
    $email: String,
    $gender: String,
    $designation: String,
    $salary: Float,
    $date_of_joining: String,
    $department: String,
    $employee_photo: String
  ) {
    updateEmployee(
      eid: $eid,
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining,
      department: $department,
      employee_photo: $employee_photo
    ) {
      id
      first_name
      last_name
      email
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.query<any>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only'
    });
  }

  getEmployeeById(id: string) {
    return this.apollo.query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { eid: id },
      fetchPolicy: 'network-only'
    });
  }

  searchEmployees(designation: string, department: string) {
    return this.apollo.query<any>({
      query: SEARCH_EMPLOYEES,
      variables: { designation, department },
      fetchPolicy: 'network-only'
    });
  }

  addEmployee(employee: any) {
    return this.apollo.mutate<any>({
      mutation: ADD_EMPLOYEE,
      variables: employee
    });
  }

  updateEmployee(id: string, employee: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE,
      variables: { eid: id, ...employee }
    });
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate<any>({
      mutation: DELETE_EMPLOYEE,
      variables: { eid: id }
    });
  }
}
