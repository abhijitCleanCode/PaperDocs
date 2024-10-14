import { currentUser } from "@clerk/nextjs/server";
import { liveblocks } from "../../../lib/liveblock";
import { redirect } from "next/navigation";
import { getUserColor } from "@/lib/utils";

export async function POST(request: Request) {
    // Get the current user from your database
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
  
  // form the user in such as way that liveblocks recognize or accept it 
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser({
    userId: user.info.email,
    groupIds: []
  },{ userInfo: user.info }
)

  return new Response(body, { status });
}