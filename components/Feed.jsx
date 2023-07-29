'use client'
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"


const PromptCardList = ({data, handleTagClick})=>{
  return(
    <div className="mt-16 prompt_layout">
      {data.map((post) =>(
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const fetchPosts = async ()=>{
    const response = await fetch('/api/prompt');
    const data = await response.json()
    setPosts(data);
  }
  useEffect(()=>{    
    fetchPosts()

  },[])
  
  const handleSearchChange = (e) =>{
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const result = filterPrompts(e.target.value);
        setSearchResults(result);
      }, 500)
    );
   
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const result = filterPrompts(tagName);
    setSearchResults(result);
    
  }
  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return posts.filter((post)=>
      regex.test(post.creator.username) ||
      regex.test(post.tag) ||
      regex.test(post.prompt)
    )

  }

  
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
        data={searchResults}
        handleTagClick={handleTagClick}
      />
      )
      : (
        <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
            />
      )}


    </section>
  )

}

export default Feed