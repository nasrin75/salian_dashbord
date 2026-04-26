import { ArcaptchaWidget } from "arcaptcha-react";
import { createRef } from "react";

class Recapcha extends Component {
  constructor() {
    super();
    this.ArRef = createRef();
  }
  getToken = (token) => {
    //do something with your token.
  };
  render() {
    return (
      <div>
        <ArcaptchaWidget
          ref={this.ArRef}
          site-key= "ul1hwg7g62"
          callback={this.getToken}
          theme="dark" //it's not required. Default is light
          lang="en" //it's not required. Default is fa
        />
      </div>
    );
  }
}