import Server from 'react-dom/server'

let Greet = () => <h1>Hello, Vite</h1>

console.log(Server.renderToString(<Greet />))