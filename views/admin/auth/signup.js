const layout = require('../layout');

module.exports = ({req}) => {
    return layout({
        content: `
            <div>
                Your id is: ${req.session.userId}
                <form method='POST'>
                    <input name='email' type="email" placeholder="Email">
                    <input name='password' type="password" placeholder="Password">
                    <input name='passwordConfirmation' type="password" placeholder="Password Confirmation">
                    <button>Sign Up</button>
                </form>
            </div>
            `,
        title: 'Sign Up'
    })
}
