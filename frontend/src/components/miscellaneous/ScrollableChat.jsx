import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '@/config/ChatLogic'
import { useChatState } from '@/context/ChatProvider'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Tooltip } from "@/components/ui/tooltip"
import { Avatar } from "@chakra-ui/react"
import Lottie from 'lottie-react'
import Typing from '../../animations/Typing.json';
function ScrollableChat({ message, isTyping }) {
  const { user } = useChatState();
  return (
    <ScrollableFeed style={{ scrollbars: "hidden" }} >
      {message && message.map((m, i) => {
        return <div style={{ display: "flex", position: "relative" }} key={m._id}>
          {(isSameSender(message, i, m, user._id) || isLastMessage(message, i, m, user._id)) && (
            // <Tooltip placement="bottom" showArrow content={m.sender.name}>
            //   <Avatar.Root>
            //     <Avatar.Fallback name={m.sender.name} />
            //     <Avatar.Image src={m.sender.pic} />
            //   </Avatar.Root>
            // </Tooltip>
            <Tooltip showArrow ids={{ trigger: i }} content={m.sender.name}>
              <Avatar.Root size="md" ids={{ root: i }}>
                <Avatar.Image src={m.sender.pic} />
                <Avatar.Fallback name={m.sender.name} />
              </Avatar.Root>
            </Tooltip>
          )}
          {/* "#BEE3F8" : "#B9F5D0" */}
          <span
            style={{
              backgroundColor: `${m.sender._id === user._id ? "#3790c3" : "#31be67"
                }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: isSameSenderMargin(message, i, m, user._id),
              marginTop: isSameUser(message, i, m, user._id) ? 3 : 10,
              height: "auto",
              marginBottom: "auto"
            }}
          >
            {m.content}
          </span>
        </div>
      })}
      {isTyping &&
        <Lottie animationData={Typing} loop={true} style={{ width: "60px", height: "60px", margin: "5px" }} />

      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
