import NavBar from "../../components/NavBar";
import DTHeader from "../../components/DTHeader";
import { useHistory } from 'react-router-dom';
import React from "react";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";

const PrivacyPage = (props) => {

  const history = useHistory();

  const handleButton = () =>{ 
    let path = '/'; 
    history.push(path);
  }

  let sockErrorComp = null;
  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
  }
  
  return (
    <div>
      <NavBar 
        user={props.user} 
        socket={props.mainSocket}
        audioObj={props.audioObj} 
        audioLocked={props.audioLocked}
        setAudioLockedCallback={props.setAudioLockedCallback}
        latency={props.latency}
      />
      {sockErrorComp}
      <DTHeader/>
      <Row className="justify-content-md-center">
        <Col md="8">
        <Card>
          <CardBody>
            <CardTitle><h1>Privacy &amp; Security</h1></CardTitle>
            <hr/>
            <CardText>
            <p>GoBuzzYourself Privacy Policy</p>

            <p>This Privacy Policy describes how your personal
            information is collected, used, and shared when you visit
            or make a purchase from https://gobuzzyourself.com (the
            &ldquo;Site&rdquo;).</p>

            <h2>PERSONAL INFORMATION WE COLLECT</h2>

            <p>When you visit the Site, we automatically collect
            certain information about your device, including
            information about your web browser, IP address, time zone,
            and some of the cookies that are installed on your
            device. Additionally, as you browse the Site, we collect
            information about the individual web pages or products
            that you view, what websites or search terms referred you
            to the Site, and information about how you interact with
            the Site. We refer to this automatically-collected
            information as &ldquo;Device Information.&rdquo;</p>

            <p>We collect Device Information using the following
            technologies:</p>

            <ul>
	      <li>&ldquo;Cookies&rdquo; are data files that are placed
                on your device or computer and often include an anonymous
                unique identifier. For more information about cookies, and
		how to disable cookies, visit http://www.allaboutcookies.org.
	      </li>
	      <li>
		&ldquo;Log files&rdquo;
                track actions occurring on the Site, and collect data
                including your IP address, browser type, Internet service
		provider, referring/exit pages, and date/time stamps.
	      </li>
	      <li>
                &ldquo;Web beacons,&rdquo; &ldquo;tags,&rdquo; and
                &ldquo;pixels&rdquo; are electronic files used to record
                information about how you browse the Site.
	      </li>
	    </ul>
	    
            <h2>SHARING YOUR PERSONAL INFORMATION</h2>

            <p>We share your Personal Information with third parties
            to help us use your Personal Information, as described
            above. For example, we use Shopify to power our online
            store--you can read more about how Shopify uses your
            Personal Information here:
            https://www.shopify.com/legal/privacy. We also use Google
            Analytics to help us understand how our customers use the
            Site--you can read more about how Google uses your
            Personal Information here:
            https://www.google.com/intl/en/policies/privacy/. You can
            also opt-out of Google Analytics here:
            https://tools.google.com/dlpage/gaoptout.</p>

            <p>Finally, we may also share your Personal Information to
            comply with applicable laws and regulations, to respond to
            a subpoena, search warrant or other lawful request for
            information we receive, or to otherwise protect our
            rights.</p>

            <p>BEHAVIOURAL ADVERTISING As described above, we use your
            Personal Information to provide you with targeted
            advertisements or marketing communications we believe may
            be of interest to you. For more information about how
            targeted advertising works, you can visit the Network
            Advertising Initiative&rsquo;s (&ldquo;NAI&rdquo;)
            educational page at
            http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.</p>

            <p>
              You can opt out of targeted advertising by opting out on the individual 
              services we use:
            </p>
            <ul>
              <li>FACEBOOK - https://www.facebook.com/settings/?tab=ads</li>
              <li>GOOGLE - https://www.google.com/settings/ads/anonymous</li>
              <li>BING -https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads</li>
            </ul>

            <p>Additionally, you can opt out of some of these services
            by visiting the Digital Advertising Alliance&rsquo;s
            opt-out portal at: http://optout.aboutads.info/.</p>

            <p>DO NOT TRACK Please note that we do not alter our
            Site&rsquo;s data collection and use practices when we see
            a Do Not Track signal from your browser.</p>

	    <h2>CHANGES</h2>

            <p>We may update this privacy policy from time to time in
            order to reflect, for example, changes to our practices or
            for other operational, legal or regulatory reasons.</p>

            <p>CONTACT US For more information about our privacy
            practices, if you have questions, or if you would like to
            make a complaint, please contact us by e-mail at
            sales@retina.net or by mail using the details provided
            below:</p>

            <p>Go Buzz Yourself, San Francisco, CA, 94103, United States. sales@retina.net</p>
            </CardText>
            <Button color="primary" className="px-4" onClick={handleButton  } > Go back </Button>
         </CardBody>
        </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PrivacyPage;

