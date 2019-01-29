import { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY {
        getPost(_id: "a44edbf6-0654-4393-b703-bf717012a205") {
            _id
            author {
                _id
                image {
                    _id
                    caption
                    credit
                    description
                    filename
                    mimeType
                    path
                    title
                    uploadStatus
                }
                name
            }
            bodyHtml(
                images: {
                    default: { w: 500, h: 500 }
                    small: { w: 250, h: 250 }
                    medium: { w: 500, h: 500 }
                    large: { w: 1000, h: 1000 }
                }
            )
            deck
            featureImage {
                _id
                caption
                credit
                description
                filename
                mimeType
                path
                title
                uploadStatus
            }
            tags {
                _id
                name
            }
            title
        }

    }
`
export default class extends Component {
  static async getInitialProps ({query: {id, cached}}) {
    return {}
  }

  render () {
    return (
      <Query query={SINGLE_ITEM_QUERY} ssr={true}>
        {({data, error, loading}) => {
          console.log('this.props', data)
          if (error) return (
            <div>
              {JSON.stringify(error)}
            </div>
          )
          if (loading) return <div>...Loading</div>
          if (!data.getPost) return <p>No Item found for {this.props.id}</p>
          const {getPost} = data
          const url = 'https://images.takeshape.io/'
          return (
            <div>
              <h1>{getPost.title}</h1>
              <div>
                <h5>{getPost.author.name}</h5>
                <div><img style={{width: 300}} src={url + getPost.author.image.path} alt=""/></div>
              </div>
              <div>
                {/*<img src={getImageUrl('/my/image/path', {w: 300, h: 250})}/> */}
                <img style={{maxWidth: '100%'}} src={url + getPost.featureImage.path} alt=""/></div>
              <p>
                {getPost.deck}
              </p>
              <div dangerouslySetInnerHTML={{__html: getPost.bodyHtml}}/>
            </div>
          )
        }}
      </Query>
    )
  }
}
