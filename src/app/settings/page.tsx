"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Trash2 } from "lucide-react";

export default function SettingsPage() {
  // Profile
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@fourthandhope.org");
  // Password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  // Theme
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveProfile = () => {
    // TODO: persist profile
    alert("Profile saved");
  };

  const handleChangePassword = () => {
    if (newPwd !== confirmPwd) {
      alert("Passwords do not match");
      return;
    }
    // TODO: persist password change
    alert("Password updated");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  const handleSaveNotifications = () => {
    // TODO: persist notifications
    alert("Notification settings saved");
  };

  const handleToggleTheme = () => {
    setDarkMode((dm) => !dm);
    // TODO: apply theme
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      // TODO: delete account
      alert("Account deleted");
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-10 flex items-center bg-white px-6 py-4 shadow-sm">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-4">
            <ChevronLeft className="h-5 w-5 text-green-600" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-green-800">Settings</h1>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={name} />
                <AvatarFallback>FH</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white mt-2"
              onClick={handleSaveProfile}
            >
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleChangePassword}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSaveNotifications}
            >
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={handleToggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              className="flex items-center space-x-2"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Account</span>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
