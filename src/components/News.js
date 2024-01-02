import React, { Component } from 'react'
import NewsItems from './NewsItems'
import Loading from './Loading';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {

    static defaultProps = {
        country: 'us',
        pageSize:12,
        category: 'general'
    }

    static propTypes= {
        country : PropTypes.string,
        pageSize : PropTypes.number,
        category : PropTypes.string
    }

    constructor(props){
        super(props);
        this.state= { 
            articles: [],
            page: 1,
            totalResults:0
        }
    }
    async updateNews(){
        this.props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=12`
        this.setState({loading: true})
        let data = await fetch((url))
        this.props.setProgress(30);
        let parsedData = await data.json()
        this.props.setProgress(70);
        this.setState({articles: parsedData.articles,
            totalResults: parsedData.totalResults ,
            loading: false
        })
        this.props.setProgress(100);
    }
    async componentDidMount(){
        this.updateNews();
    }
    fetchMoreData = async () =>{
        this.setState({page: this.state.page + 1});
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=12`
        const data = await fetch(url);
        const parsedData = await data.json();
        this.setState({articles: this.state.articles.concat(parsedData.articles),
          totalResults: parsedData.totalResults
        });
    }
    // prevPg = async ()=>{
    //     this.setState({page : this.state.page -1})
    //     this.updateNews();
    // }

    // nxtPg = async ()=>{
    //     if (this.state.page + 1 > Math.ceil(this.state.totalResults/12)) {
        
    //     } else {
    //         this.setState({page: this.state.page + 1});
    //         this.updateNews()
    //     }
    // }
  render() {
    return (
      <div>
        <div className='container my-3'>
            <h2>Headlines</h2>
            {this.state.loading && <Loading/>}
            <InfiniteScroll
                dataLength={this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles.length < this.state.totalResults}
                loader={<Loading/>}
        >
          
                <div className='container'>
                    <div className='row'>
                        {this.state.articles.map((element)=>{
                        return <div className='col-md-4' key={element.url}>
                                    <NewsItems title={element.title?element.title.slice(0,50):""} description={element.description?element.description.slice(0,50):""} imgUrl={element.urlToImage} newsUrl={element.url}/>
                                </div>
                     })}
            
                    </div>
                </div>
            </InfiniteScroll>

            {/* <div className="d-flex justify-content-between my-3">
            <button type="button" disabled={this.state.page<=1} onClick={this.prevPg} className="btn btn-dark">&larr; Previous</button>
            <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/12)} onClick={this.nxtPg} className="btn btn-dark">Next &rarr;</button>
            </div> */}
        </div>
      </div>
    )
  }
}
