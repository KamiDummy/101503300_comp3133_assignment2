import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const LOGIN_QUERY = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      id
      username
      email
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apollo: Apollo, private router: Router) {}

  login(usernameOrEmail: string, password: string) {
    return this.apollo.query<any>({
      query: LOGIN_QUERY,
      variables: { usernameOrEmail, password },
      fetchPolicy: 'network-only'
    });
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate<any>({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    });
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
