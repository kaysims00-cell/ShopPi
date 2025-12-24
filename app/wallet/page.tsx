"use client"

import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Copy, Send, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"

const transactions = [
  {
    id: 1,
    type: "receive",
    description: "Payment from Sarah M.",
    amount: 89.99,
    date: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "send",
    description: "Purchased Smart Watch",
    amount: -199.99,
    date: "5 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "receive",
    description: "Payment from John D.",
    amount: 199.99,
    date: "1 day ago",
    status: "completed",
  },
  {
    id: 4,
    type: "send",
    description: "Purchased Earbuds",
    amount: -89.99,
    date: "2 days ago",
    status: "completed",
  },
  {
    id: 5,
    type: "receive",
    description: "Payment from Emily R.",
    amount: 34.99,
    date: "3 days ago",
    status: "completed",
  },
]

export default function WalletPage() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "GC7X...4K2P"
  const balance = 1245.67

  const copyAddress = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Pi Wallet</h1>
        </div>
      </header>

      {/* Balance Card */}
      <div className="bg-primary text-primary-foreground p-6">
        <p className="text-sm opacity-90 mb-2">Total Balance</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold">π</span>
          <span className="text-4xl font-bold">{balance.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
          <span className="flex-1 text-sm font-mono">{walletAddress}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAddress}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            {copied ? <span className="text-xs">✓</span> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">Send</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <Download className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs font-medium text-foreground">Receive</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
              <Clock className="h-5 w-5 text-foreground" />
            </div>
            <p className="text-xs font-medium text-foreground">History</p>
          </Card>
        </div>

        {/* Transactions */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === "receive" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {transaction.type === "receive" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-bold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}π {Math.abs(transaction.amount)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="received" className="mt-4 space-y-3">
            {transactions
              .filter((t) => t.type === "receive")
              .map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-green-500">+π {transaction.amount}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="sent" className="mt-4 space-y-3">
            {transactions
              .filter((t) => t.type === "send")
              .map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-red-500">π {Math.abs(transaction.amount)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
