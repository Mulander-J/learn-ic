import { microblog } from "../../declarations/microblog";
import { Principal } from "@dfinity/principal";
import BigNumber from "bignumber.js";

const DEFAULT_NAME = 'Anonymous';

Vue.createApp({
  data() {
    return {
      localName: DEFAULT_NAME,
      postVal: '',
      postSecret: '',
      remoteUser: {
        name: DEFAULT_NAME,
        id:'',
      },
      userTab: 'following',
      msgTab: 0,
      loadings: [],
      myFollower: [],
      myFollowing: [],
      focusLine: []
    }
  },
  computed:{
    num_follower(){
      return this.myFollower.length || 0
    },
    num_following(){
      return this.myFollowing.length || 0
    },
    user_list(){
      switch (this.userTab){
        case 'following':
          return this.myFollowing;
        case 'follower':
          return this.myFollower;
        default:
            return []
      }
    },
    breadTab(){
      switch (this.msgTab){
        case 0:
          return 'My Posts';
        case 1:
          return 'Follows\' Post';
        case 2:
          return `@${this.remoteUser.name || DEFAULT_NAME}`
        default:
            return DEFAULT_NAME
      } 
    }
  },
  watch:{
    msgTab:{
      immediate:true,
      handler(tab){
        switch (tab){
          case 0:
            this.tryHelper(microblog.posts,[],(res)=>{
              this.focusLine = timeFormat(res)
            },0)
            break;
          case 1:
            this.tryHelper(microblog.timeline,[],(res)=>{
              this.focusLine = timeFormat(res)
            },0)
            break;
          case 2:
            this.tryHelper(microblog.getRemotePosts,[],(res)=>{
              this.focusLine = timeFormat(res)
            },Principal.fromText(this.remoteUser.id),0)
            break
          default:
            console.log(tab)
        }
      }
    }
  },
  methods: {
    async tryHelper (_cmd, _def, _call, ...args) {
      this.loadings.push(1);
      let _res;
      try{
        _res = await _cmd(...args);
        console.log('[_res]', _res);
      }catch(err){
        console.log(err)
        _res = _def
      } finally{
        _call(_res || _def)
        this.loadings.pop();
      }
    },
    async skipTab(tab, author){
      if(this.loadings.length>0) return
      tab ===2 && (this.remoteUser = author)
      this.msgTab = tab
    },
    async addPost(){
      this.tryHelper(microblog.post,null,(res)=>{
        alert(res.err || res.ok);
      },this.postVal,this.postSecret);
    },
    async addFollow(){
      alert('Nothing happend.')
    },
    getAuthorName(post){
      switch (msgTab){
        case 0:
          return this.localName
        case 1:
          return post.author.user.name
        case 2:
          return this.remoteUser.name
        case 3:
          return DEFAULT_NAME
      }
    }
  },
  mounted() {
    this.tryHelper(microblog.get_name,DEFAULT_NAME,(res)=>{
      this.localName = res
    })
    this.tryHelper(microblog.follows,[],(res)=>{
      this.myFollowing = res.map(e=>(
        {
          id:e.id._isPrincipal? e.id.toString() : 'No Principal',
          name:e.user.name
        }
      ))
    }) 
    this.tryHelper(microblog.followBys,[],(res)=>{
      this.myFollower = res.map(e=>(
        {
          id:e.id._isPrincipal? e.id.toString() : 'No Principal',
          name:e.user.name
        }
      ))
    })
  },
}).mount('#app')

const timeFormat = (list)=>list.map(e=>({
  ...e,
  time: new Date(Math.floor(BigNumber(e.time).toNumber()/1e6)).toLocaleString()
}))
