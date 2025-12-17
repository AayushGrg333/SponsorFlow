"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { authStorage } from "../../../../lib/authHelper";

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
  followers: string
  link: string
}

export default function ProfileSetupPage() {

  const router = useRouter()
  const params = useParams()
  const usertype = params.usertype as string
  const isInfluencer = usertype === "influencer"

   // 🔒 BLOCK PROFILE SETUP IF ALREADY COMPLETED
  useEffect(() => {
    const user = authStorage.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.isProfileComplete) {
      router.replace(
        user.role === "influencer"
          ? "/dashboard/influencer"
          : "/dashboard/company"
      )
    }
  }, [])

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // ============= INFLUENCER STATE (DON'T TOUCH) =============
  const [realName, setRealName] = useState({
    givenName: "",
    middleName: "",
    familyName: "",
  })
  const [displayName, setDisplayName] = useState("")

  const [influencerProfile, setInfluencerProfile] = useState({
    bio: "",
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: "",
    followers: "",
    experience: "",
  })

  const [previousSponsorships, setPreviousSponsorships] = useState<string[]>([])
  const [platformRows, setPlatformRows] = useState<PlatformRow[]>([])

  // ============= COMPANY STATE (UPDATED FOR BACKEND) =============
 const [companyProfile, setCompanyProfile] = useState({
  email: "",
  description: "",
  addressType: "Online" as "Online" | "Physical",
  address: "",
  contactNumber: "",
  establishedYear: new Date().getFullYear(),
  products: [] as string[],

  // Social links
  website: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  facebook: "",
});


  const [productInput, setProductInput] = useState("")

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

  // ============= COMPANY HELPERS =============
  const addProduct = () => {
    if (productInput.trim()) {
      setCompanyProfile({
        ...companyProfile,
        products: [...companyProfile.products, productInput.trim()],
      })
      setProductInput("")
    }
  }

  const removeProduct = (index: number) => {
    const newProducts = [...companyProfile.products]
    newProducts.splice(index, 1)
    setCompanyProfile({ ...companyProfile, products: newProducts })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    if (isInfluencer) {
      // ============= INFLUENCER SUBMISSION (DON'T TOUCH) =============
      const socialMediaProfileLinks = [
        influencerProfile.instagram ? { platform: "instagram", url: influencerProfile.instagram } : null,
        influencerProfile.facebook ? { platform: "facebook", url: influencerProfile.facebook } : null,
        influencerProfile.youtube ? { platform: "youtube", url: influencerProfile.youtube } : null,
        influencerProfile.twitter ? { platform: "twitter", url: influencerProfile.twitter } : null,
      ].filter(Boolean) as { platform: string; url: string }[]

      const platforms = platformRows
        .filter((r) => r.platform && r.link)
        .map((r) => ({
          platform: r.platform,
          followers: r.followers ? Number.parseInt(r.followers) : 0,
          url: r.link,
        }))

      const { error: apiError } = await influencerAPI.setupProfile({
        realName: realName,
        displayName: displayName || realName.givenName + " " + realName.familyName,
        bio: influencerProfile.bio || "",
        categories: selectedCategories,
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

      authStorage.updateUser({ isProfileComplete: true });

      router.push("/dashboard/influencer")
    } else {
      // ============= COMPANY SUBMISSION (UPDATED) =============
      const contentType = selectedCategories.map((name) => ({ name }))
const socialLinks = [
  companyProfile.website && { platform: "website", link: companyProfile.website },
  companyProfile.instagram && { platform: "instagram", link: companyProfile.instagram },
  companyProfile.linkedin && { platform: "linkedin", link: companyProfile.linkedin },
  companyProfile.twitter && { platform: "twitter", link: companyProfile.twitter },
  companyProfile.youtube && { platform: "youtube", link: companyProfile.youtube },
  companyProfile.facebook && { platform: "facebook", link: companyProfile.facebook },
].filter(Boolean) as { platform: string; link: string }[];



     const payload = {
  email: companyProfile.email,
  addressType: companyProfile.addressType,
  ...(companyProfile.addressType === "Physical" && companyProfile.address
    ? { address: companyProfile.address }
    : {}),
  contactNumber: companyProfile.contactNumber,
  categories: selectedCategories, // or whatever your categories are
  contentType: selectedCategories.map((name) => ({ name })),
  products: companyProfile.products,
  establishedYear: companyProfile.establishedYear,
  ...(companyProfile.description ? { description: companyProfile.description } : {}),
  socialLinks, // mapped array
  ...(avatarPreview ? { profileImage: avatarPreview } : {}),
};


      const { error: apiError } = await companyAPI.setupProfile(payload)

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

            {/* ============= INFLUENCER FIELDS (DON'T TOUCH) ============= */}
            {isInfluencer && (
              <>
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

                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    placeholder="Display name (e.g., John Doe, JD Creator)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    placeholder="Tell brands about yourself, your content style, and what makes you unique..."
                    className="min-h-[120px] resize-none"
                    value={influencerProfile.bio}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, bio: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* ============= COMPANY FIELDS (UPDATED) ============= */}
            {!isInfluencer && (
              <>
                <div className="space-y-2">
                  <Label>Company Email *</Label>
                  <Input
                    type="email"
                    placeholder="contact@company.com"
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Description</Label>
                  <Textarea
                    placeholder="Describe your company, products, and what you're looking for in influencer partnerships..."
                    className="min-h-[120px] resize-none"
                    value={companyProfile.description}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Number *</Label>
                  <Input
                    placeholder="+977-9876543210"
                    value={companyProfile.contactNumber}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, contactNumber: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Address Type *</Label>
                    <select
                      className="h-9 w-full rounded-md border px-3 text-sm bg-black"
                      value={companyProfile.addressType}
                      onChange={(e) =>
                        setCompanyProfile({
                          ...companyProfile,
                          addressType: e.target.value as "Online" | "Physical",
                        })
                      }
                    >
                      <option value="Online">Online</option>
                      <option value="Physical">Physical</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Established Year *</Label>
                    <Input
                      type="number"
                      placeholder="2020"
                      value={companyProfile.establishedYear}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, establishedYear: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {companyProfile.addressType === "Physical" && (
                  <div className="space-y-2">
                    <Label>Physical Address *</Label>
                    <Input
                      placeholder="123 Main Street, Kathmandu"
                      value={companyProfile.address}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Products/Services *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a product or service"
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
                    />
                    <Button type="button" onClick={addProduct} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {companyProfile.products.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {companyProfile.products.map((product, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {product}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeProduct(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ============= COMMON: CATEGORIES ============= */}
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
          // ============= INFLUENCER STEP 2 (DON'T TOUCH) =============
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
                <Label>Facebook</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://facebook.com/..."
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
          // ============= COMPANY STEP 2 (UPDATED - SOCIAL LINKS) =============
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Social Links & Online Presence</h2>
              <p className="mt-2 text-muted-foreground">Connect your company's social media accounts</p>
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

              <div className="space-y-2">
                <Label>Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://instagram.com/yourcompany"
                    className="pl-10"
                    value={companyProfile.instagram}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="pl-10"
                    value={companyProfile.linkedin}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Twitter/X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://twitter.com/yourcompany"
                    className="pl-10"
                    value={companyProfile.twitter}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, twitter: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>YouTube</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://youtube.com/@yourcompany"
                    className="pl-10"
                    value={companyProfile.youtube}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, youtube: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Facebook</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="https://facebook.com/yourcompany"
                    className="pl-10"
                    value={companyProfile.facebook}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, facebook: e.target.value })}
                  />
                </div>
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