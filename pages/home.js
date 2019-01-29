import Link from 'next/link'
import { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        posts{
            nodes{
                title
                id
            }
            pageInfo{
                hasNextPage
                hasPreviousPage
            }
        }
    }
`
export default class extends Component {
  static async getInitialProps () {
    return {}
  }

  render () {
    return (
      <div>
        <h1>Home Posts</h1>
        <Link href={`/sickfits`}>
          <a>sick</a>
        </Link>
        <Link href={`/fakerql`}>
          <a>fakerql</a>
        </Link>
        <Query query={ALL_ITEMS_QUERY} ssr={true}>
          {({data, error, loading}) => {
            if (error) return (
              <div>
                {JSON.stringify(error)}
              </div>
            )
            if (loading) return <div>...Loading</div>
            if (!data.posts) return <p>No Item found for {this.props.id}</p>
            const {posts: {nodes}} = data
            return (
              <ul>
                {nodes && nodes.map(post => (
                  <li key={post.id}>
                    <Link prefetch href={`/blog?id=${post.id}`} as={`/blog/${post.id}`}>
                      <a>{post.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          }}
        </Query>
      </div>
    )
  }
}

