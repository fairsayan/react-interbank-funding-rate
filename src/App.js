import './App.css'
import cheerio from 'cheerio'
import axios from 'axios'
import { useState, useEffect } from 'react'

function getDataFromHtml(html) {
    const $ = cheerio.load(html)
    const rows = $('table').eq(2).find('tr')
    const data = []
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows.eq(i)
        const index = row.find('td').eq(0).text().trim()
        const interbankFundingRate = row.find('td').eq(1).text().trim()
        if (!index) continue
        data.push([index, interbankFundingRate])
    }

    return data
}

function Table(props) {
    const rows = props.data.map( row => (
        <tr>
            <td>{ row[0] }</td>
            <td>{ row[1] }</td>
        </tr>
    ) )

    return ( <table> { rows } </table> )
}

function App() {
    const [data, setData] = useState(null)

    useEffect( () => {
        async function fetchData() {
            try {
                const proxy = 'https://cors-anywhere.herokuapp.com/' // avoiding CORS
                const url = 'https://www.oanda.com/rw-en/trading/financing-costs/'
                const response = await axios.get(`${proxy}${url}`)
                setData( getDataFromHtml(response.data) )
            } catch (e) {
                console.error(e)
            }
        }
        if (!data) fetchData()
    })

    return (
        <div className="App">
            { data ? <Table data={ data } /> : null }
        </div>
    )
}

export default App
