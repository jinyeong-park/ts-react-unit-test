import { Login } from '../components/login';
import { LoginService } from '../services/LoginService';
//jest.mock('./services/LoginService');
import * as ReactDOM from 'react-dom';
import React from 'react';
import { fireEvent, waitForElement } from '@testing-library/react';


describe('Login component tests', () => {

    let container: HTMLDivElement
    // spy object to simulate login method(public) from loginservice
    const loginServiceSpy = jest.spyOn(LoginService.prototype, 'login');
    // test setup
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<Login />, container);
    })
    // after each test, clear everything
    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
    })

    it('Renders correctly initial document', () => {
        //check the number of input elements
        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].name).toBe('login');
        expect(inputs[1].name).toBe('password');
        expect(inputs[2].value).toBe('Login');

        // check label element doesnt render initially (conditional rendering part)
        const label = container.querySelector('label');
        expect(label).not.toBeInTheDocument();

    });

    it('Renders correctly initial document with data-test query', () => {
        expect(container.querySelector("[data-test='login-form']")).toBeInTheDocument();
        expect(container.querySelector("[data-test='login-input']")?.getAttribute('name'))
            .toBe('login');
        expect(container.querySelector("[data-test='password-input']")?.getAttribute('name'))
            .toBe('password');
    });
    // Testing user interaction: fireEvent change, click
    // form is submitted or not
    it('Passes credentials correctly', () => {
        const inputs = container.querySelectorAll('input');
        const loginInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];
        // testing click event
        fireEvent.click(loginButton);
        // testing onchange event
        fireEvent.change(loginInput, { target: { value: 'someUser' } });
        fireEvent.change(passwordInput, { target: { value: 'somePass' } });
        expect(loginServiceSpy).toBeCalledWith('someUser', 'somePass');
    });
    // Testing async code: waitForElement, mock resolve value
    it('Renders correctly status label - invalid login', async () => {
        loginServiceSpy.mockResolvedValueOnce(false);
        const inputs = container.querySelectorAll('input');
        const loginButton = inputs[2];
        fireEvent.click(loginButton);

        // since this(login response, container.querySelector('label')) is async, this happens before login button
        // async fn -> use waitForElement fn
        const statusLabel = await waitForElement(() =>
            container.querySelector('label')
        );
        expect(statusLabel).toBeInTheDocument();
        expect(statusLabel).toHaveTextContent('Login failed');
    });
    // Testing async code: waitForElement, mock resolve value
    it('Renders correctly status label - valid login', async () => {
        loginServiceSpy.mockResolvedValueOnce(true);
        const inputs = container.querySelectorAll('input');
        const loginButton = inputs[2];
        fireEvent.click(loginButton);
        const statusLabel = await waitForElement(() =>
            container.querySelector('label')
        );
        expect(statusLabel).toBeInTheDocument();
        expect(statusLabel).toHaveTextContent('Login successful');
    });



})