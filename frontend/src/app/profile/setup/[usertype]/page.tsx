"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  X,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Loader2,
  CheckCircle2,
  Users,
  Building2,
  Plus,
} from "lucide-react"
import { influencerAPI, companyAPI } from "@/lib/api"

const categories = [
  "Tech",
  "Gaming",
  "Lifestyle",
  "Fashion",
  "Beauty",
  "Skincare",
  "Food",
  "Travel",
  "Fitness",
  "Finance",
  "Education",
  "Entertainment",
  "Photography",
  "Music",
  "Art",
  "Sports",
  "Health",
  "Parenting",
]

type PlatformRow = {
  id: string
  platform: string
  followers: string // keep as string in UI, convert on submit
   link: string
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const params = useParams()
  const usertype = params.usertype as string
  const isInfluencer = usertype === "influencer"

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // ---- NEW: realName + displayName (required by backend) ----
  const [realName, setRealName] = useState({
    givenName: "",
    middleName: "",
    familyName: "",
  })
  const [displayName, setDisplayName] = useState("")

  // Existing influencerProfile kept for compatibility with UI
  const [influencerProfile, setInfluencerProfile] = useState({
    bio: "",
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: "",
    followers: "",
    experience: "",
  })

  // ---- NEW: previous sponsorships (array of strings) ----
  const [previousSponsorships, setPreviousSponsorships] = useState<string[]>([])

  // ---- NEW: platforms array (platform, followers, engagementRate) ----
  const [platformRows, setPlatformRows] = useState<PlatformRow[]>([])

  const [companyProfile, setCompanyProfile] = useState({
    description: "",
    website: "",
    industry: "",
    size: "",
    targetAudience: "",
    marketingBudget: "",
  })

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // ---- Platform row helpers ----
  const addPlatformRow = () => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2)
    setPlatformRows([...platformRows, { id, platform: "", followers: "", link: "" }])
  }
  const updatePlatformRow = (id: string, patch: Partial<PlatformRow>) => {
    setPlatformRows(platformRows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }
  const removePlatformRow = (id: string) => {
    setPlatformRows(platformRows.filter((r) => r.id !== id))
  }

  // ---- Previous sponsorships helpers ----
  const addPreviousSponsorship = () => setPreviousSponsorships([...previousSponsorships, ""])
  const updatePreviousSponsorship = (index: number, val: string) => {
    const arr = [...previousSponsorships]
    arr[index] = val
    setPreviousSponsorships(arr)
  }
  const removePreviousSponsorship = (index: number) => {
    const arr = [...previousSponsorships]
    arr.splice(index, 1)
    setPreviousSponsorships(arr)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    if (isInfluencer) {
      // Build socialMediaProfileLinks array from the simple social inputs (keeps your existing UI)
      const socialMediaProfileLinks = [
        influencerProfile.instagram ? { platform: "instagram", url: influencerProfile.instagram } : null,
        influencerProfile.facebook ? { platform: "facebook", url: influencerProfile.facebook } : null,
        influencerProfile.youtube ? { platform: "youtube", url: influencerProfile.youtube } : null,
        influencerProfile.twitter ? { platform: "twitter", url: influencerProfile.twitter } : null,
      ].filter(Boolean) as { platform: string; url: string }[]

      // Build platforms array converting numbers
const platforms = platformRows
  .filter((r) => r.platform && r.link)
  .map((r) => ({
    platform: r.platform,
    followers: r.followers ? Number.parseInt(r.followers) : 0,
    url: r.link, // send as url instead of engagementRate
  }))

      // Map selectedCategories -> contentType objects (backend expects array of objects)
      const contentType = selectedCategories.map((name) => ({ name }))

      // Final payload matching influencerProfileSchema
      const backendPayload = {
        realName: {
          givenName: realName.givenName,
          middleName: realName.middleName || undefined,
          familyName: realName.familyName,
        },
        displayName: displayName || realName.givenName + " " + realName.familyName, // ensure something there
        bio: influencerProfile.bio || "",
        socialMediaProfileLinks,
        experienceYears: influencerProfile.experience ? Number.parseInt(influencerProfile.experience) : 0,
        previousSponsorships: previousSponsorships.filter((s) => s.trim() !== ""),
        contentType,
        profileImage: avatarPreview || undefined,
        platforms,
      }

      const { error: apiError } = await influencerAPI.setupProfile({
  realName: realName,
  displayName: displayName || influencerProfile.instagram || "",
  bio: influencerProfile.bio || "",
  categories: selectedCategories,            // <- required by setupProfile()
  instagram: influencerProfile.instagram,
  youtube: influencerProfile.youtube,
  twitter: influencerProfile.twitter,
  facebook: influencerProfile.facebook,
  followers: influencerProfile.followers ? Number.parseInt(influencerProfile.followers) : undefined,
  experience: influencerProfile.experience ? Number.parseInt(influencerProfile.experience) : undefined,
  avatar: avatarPreview || undefined,
})


      if (apiError) {
        setError(apiError)
        setIsLoading(false)
        return
      }

      router.push("/dashboard/influencer")
    } else {
      const { error: apiError } = await companyAPI.setupProfile({
        description: companyProfile.description,
        categories: selectedCategories,
        website: companyProfile.website,
        industry: companyProfile.industry,
        size: companyProfile.size,
        targetAudience: companyProfile.targetAudience,
        marketingBudget: companyProfile.marketingBudget,
        logo: avatarPreview || undefined,
      })

      if (apiError) {
        setError(apiError)
        setIsLoading(false)
        return
      }

      router.push("/dashboard/company")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {isInfluencer ? "Complete Your Profile" : "Set Up Your Company"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isInfluencer
                  ? "Tell brands about yourself and your content"
                  : "Tell influencers about your company and goals"}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {isInfluencer ? "Upload your photo" : "Upload company logo"}
              </p>
            </div>

            {/* NEW: Name fields + Display Name (keeps UI look consistent) */}
            {isInfluencer && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Given Name</Label>
                  <Input
                    placeholder="Given name"
                    value={realName.givenName}
                    onChange={(e) => setRealName({ ...realName, givenName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Middle Name</Label>
                  <Input
                    placeholder="Middle name (optional)"
                    value={realName.middleName}
                    onChange={(e) => setRealName({ ...realName, middleName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Family Name</Label>
                  <Input
                    placeholder="Family name"
                    value={realName.familyName}
                    onChange={(e) => setRealName({ ...realName, familyName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>{isInfluencer ? "Display Name" : "Company Description"}</Label>
              {isInfluencer ? (
                <Input
                  placeholder="Display name (e.g., John Doe, JD Creator)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              ) : (
                <Textarea
                  placeholder="Describe your company, products, and what you're looking for in influencer partnerships..."
                  className="min-h-[120px] resize-none"
                  value={companyProfile.description}
                  onChange={(e) => {
                    setCompanyProfile({ ...companyProfile, description: e.target.value })
                  }}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>{isInfluencer ? "Bio" : "Company Description"}</Label>
              <Textarea
                placeholder={
                  isInfluencer
                    ? "Tell brands about yourself, your content style, and what makes you unique..."
                    : "Describe your company, products, and what you're looking for in influencer partnerships..."
                }
                className="min-h-[120px] resize-none"
                value={isInfluencer ? influencerProfile.bio : companyProfile.description}
                onChange={(e) => {
                  if (isInfluencer) {
                    setInfluencerProfile({ ...influencerProfile, bio: e.target.value })
                  } else {
                    setCompanyProfile({ ...companyProfile, description: e.target.value })
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Categories ({selectedCategories.length}/5)</Label>
              <p className="text-sm text-muted-foreground">
                {isInfluencer
                  ? "Choose categories that best describe your content"
                  : "Choose categories that match your products/services"}
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedCategories.includes(category)
                        ? "bg-primary text-primary-foreground"
                        : "hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    {selectedCategories.includes(category) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return isInfluencer ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Social Media & Reach</h2>
              <p className="mt-2 text-muted-foreground">Connect your social profiles and share your reach</p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="@username"
                    className="pl-10"
                    value={influencerProfile.instagram}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>YouTube</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Channel URL"
                    className="pl-10"
                    value={influencerProfile.youtube}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, youtube: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Twitter/X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="@handle"
                    className="pl-10"
                    value={influencerProfile.twitter}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, twitter: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Website/Portfolio</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://yourfacebook.com"
                    className="pl-10"
                    value={influencerProfile.facebook}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, facebook: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Followers</Label>
                  <Input
                    placeholder="e.g., 50000"
                    type="number"
                    value={influencerProfile.followers}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, followers: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input
                    placeholder="e.g., 3"
                    type="number"
                    value={influencerProfile.experience}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, experience: e.target.value })}
                  />
                </div>
              </div>

{/* NEW: Platforms dynamic rows */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label>Platforms (followers & link)</Label>
    <Button variant="outline" onClick={addPlatformRow} size="sm">
      <Plus className="mr-2 h-3 w-3" /> Add
    </Button>
  </div>

  <div className="space-y-3">
    {platformRows.length === 0 && (
      <p className="text-sm text-muted-foreground">
        No platforms added yet. Use Add to include platform stats.
      </p>
    )}

    {platformRows.map((row) => (
      <div key={row.id} className="grid gap-2 sm:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-xs">Platform</Label>
          <select
            className="h-9 rounded-md border px-2 text-sm bg-black"
            value={row.platform}
            onChange={(e) => updatePlatformRow(row.id, { platform: e.target.value })}
          >
            <option value="">Select</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Followers</Label>
          <Input
            placeholder="e.g., 12000"
            value={row.followers}
            onChange={(e) => updatePlatformRow(row.id, { followers: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Link / URL</Label>
          <Input
            placeholder="https://..."
            value={row.link}
            onChange={(e) => updatePlatformRow(row.id, { link: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <Button variant="ghost" onClick={() => removePlatformRow(row.id)} className="ml-auto">
            Remove
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* NEW: Previous sponsorships (array) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Previous Sponsorships</Label>
                  <Button variant="outline" onClick={addPreviousSponsorship} size="sm">
                    <Plus className="mr-2 h-3 w-3" /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {previousSponsorships.length === 0 && (
                    <p className="text-sm text-muted-foreground">You can list past brand collaborations (optional).</p>
                  )}

                  {previousSponsorships.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Brand or campaign name"
                        value={s}
                        onChange={(e) => updatePreviousSponsorship(i, e.target.value)}
                      />
                      <Button variant="ghost" onClick={() => removePreviousSponsorship(i)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Company Details</h2>
              <p className="mt-2 text-muted-foreground">Help influencers understand your brand</p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://yourcompany.com"
                    className="pl-10"
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input
                    placeholder="e.g., Technology"
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Input
                    placeholder="e.g., 50-200"
                    value={companyProfile.size}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, size: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Textarea
                  placeholder="Describe your target audience (age, interests, demographics)..."
                  className="min-h-[100px] resize-none"
                  value={companyProfile.targetAudience}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Monthly Marketing Budget</Label>
                <Input
                  placeholder="e.g., $5,000 - $10,000"
                  value={companyProfile.marketingBudget}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, marketingBudget: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">You&apos;re All Set!</h2>
              <p className="mt-2 text-muted-foreground">
                Your profile is ready. Start exploring {isInfluencer ? "brands" : "influencers"} and find your perfect
                match.
              </p>
            </div>

            <div className="glass-card mx-auto max-w-sm rounded-2xl p-6 text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : isInfluencer ? (
                    <Users className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your Profile</h3>
                  <p className="text-sm text-muted-foreground capitalize">{usertype}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {selectedCategories.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedCategories.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-10 w-10" />
          </div>
          <span className="text-2xl font-bold text-foreground">SponsorFlow</span>
        </Link>

        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-0.5 w-12 transition-colors sm:w-20 ${step > s ? "bg-primary" : "bg-secondary"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">{error}</div>
          )}

          {renderStep()}

          <div className="mt-8 flex justify-between gap-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Go to Dashboard"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
