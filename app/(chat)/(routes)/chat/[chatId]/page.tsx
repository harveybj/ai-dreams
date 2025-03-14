//import { redirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps {
    params: Promise<{
        chatId: string;
    }>
}

const ChatIdPage = async (props: ChatIdPageProps) => {
    const params = await props.params;
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
        return redirectToSignIn()
    }

    const companion = await prismadb.companion.findUnique({
            where: {
                id: params.chatId
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                     where:{
                        userId
                     }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            }
        });

    if (!companion) {
        return redirect("/")
    }

    return (
       <ChatClient companion={companion} />
    )
}

export default ChatIdPage;