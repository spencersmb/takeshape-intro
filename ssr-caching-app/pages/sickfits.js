import { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`
export default class extends Component {
  static async getInitialProps ({query: {id, cached}}) {
    console.log('GIT ID', id)

    return {id: id}
  }

  render () {
    return (
      <Query query={SINGLE_ITEM_QUERY} ssr={true} variables={{id: 'cjqvdj09ne8ho0917y2u0nlyd'}}>
        {({data, error, loading}) => {
          console.log('this.props', data)
          if (error) return (
            <div>
              {JSON.stringify(error)}
            </div>
          )
          if (loading) return <div>...Loading</div>
          if (!data.item) return <p>No Item found for {this.props.id}</p>
          const {post} = data
          return (
            <div>
              test
              <img src={data.item.largeImage} alt=""/>
            </div>
          )
        }}
      </Query>
    )
  }
}
