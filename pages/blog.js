import { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        post(id:$id){
            author{
                firstName
            }
            content(format: RAW)
            title
            featuredImage{
                id
                altText
            }
        }
    }
`
const IMAGE_SIZE_QUERY = gql`
    query IMAGE_SIZE_QUERY($id: ID!) {
        mediaItem(id:$id){
            mediaDetails{
                sizes{
                    width
                    sourceUrl
                }
            }
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
      <Query query={SINGLE_ITEM_QUERY} ssr={true} variables={{id: this.props.id}}>
        {({data, error, loading}) => {
          console.log('this.props', this.props)
          if (error) return (
            <div>
              {JSON.stringify(error)}
            </div>
          )
          if (loading) return <div>...Loading</div>
          if (!data.post) return <p>No Item found for {this.props.id}</p>
          const {post} = data
          return (
            <div>
              <h1>{post.title}</h1>
              <Link href={`/home`}>
                <a>Home</a>
              </Link>
              <Query query={IMAGE_SIZE_QUERY} variables={{id: post.featuredImage.id}}>
                {({data, loading}) => {
                  if (loading) return <div>...Loading feature image</div>
                  const {mediaItem} = data
                  const findLargeImage = mediaItem.mediaDetails.sizes.filter(image => image.width <= '1200')

                  return (
                    <div>
                      <img src={findLargeImage[0].sourceUrl} alt={post.featuredImage.altText}/>
                    </div>
                  )
                }}
              </Query>
              <div dangerouslySetInnerHTML={{__html: post.content}}/>
            </div>
          )
        }}
      </Query>
    )
  }
}
