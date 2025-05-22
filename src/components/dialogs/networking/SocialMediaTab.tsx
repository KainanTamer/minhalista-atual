
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, LinkIcon, Users, Music } from 'lucide-react';
import { SocialMediaLink } from '@/components/dialogs/NetworkingDialog';

interface SocialMediaState {
  [key: string]: {
    enabled: boolean;
    url: string;
  };
}

interface SocialMediaTabProps {
  socialMedia: SocialMediaState;
  handleSocialMediaChange: (platform: string, field: 'enabled' | 'url', value: boolean | string) => void;
  streamingPlatforms: SocialMediaState;
  handleStreamingChange: (platform: string, field: 'enabled' | 'url', value: boolean | string) => void;
  socialLinks: SocialMediaLink[];
  newPlatform: string;
  setNewPlatform: (platform: string) => void;
  newUrl: string;
  setNewUrl: (url: string) => void;
  addSocialLink: () => void;
  removeSocialLink: (index: number) => void;
  getSocialIcon: (platform: string) => React.ReactNode;
  socialNetworksDB: string[];
  platformsDB: string[];
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  socialMedia, handleSocialMediaChange,
  streamingPlatforms, handleStreamingChange,
  socialLinks, newPlatform, setNewPlatform,
  newUrl, setNewUrl, addSocialLink, removeSocialLink,
  getSocialIcon, socialNetworksDB, platformsDB
}) => {
  return (
    <div className="space-y-6">
      {/* Seção de Redes Sociais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Redes Sociais</h3>
        </div>
        
        <div className="space-y-3">
          {/* Instagram */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="instagram" 
                checked={socialMedia.instagram.enabled}
                onCheckedChange={(checked) => 
                  handleSocialMediaChange('instagram', 'enabled', checked === true)
                }
              />
              <Label htmlFor="instagram" className="font-medium cursor-pointer">
                Instagram
              </Label>
            </div>
            {socialMedia.instagram.enabled && (
              <Input
                value={socialMedia.instagram.url}
                onChange={(e) => handleSocialMediaChange('instagram', 'url', e.target.value)}
                placeholder="https://instagram.com/usuario"
                className="flex-1"
              />
            )}
          </div>
          
          {/* Facebook */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="facebook" 
                checked={socialMedia.facebook.enabled}
                onCheckedChange={(checked) => 
                  handleSocialMediaChange('facebook', 'enabled', checked === true)
                }
              />
              <Label htmlFor="facebook" className="font-medium cursor-pointer">
                Facebook
              </Label>
            </div>
            {socialMedia.facebook.enabled && (
              <Input
                value={socialMedia.facebook.url}
                onChange={(e) => handleSocialMediaChange('facebook', 'url', e.target.value)}
                placeholder="https://facebook.com/pagina"
                className="flex-1"
              />
            )}
          </div>
          
          {/* YouTube */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="youtube" 
                checked={socialMedia.youtube.enabled}
                onCheckedChange={(checked) => 
                  handleSocialMediaChange('youtube', 'enabled', checked === true)
                }
              />
              <Label htmlFor="youtube" className="font-medium cursor-pointer">
                YouTube
              </Label>
            </div>
            {socialMedia.youtube.enabled && (
              <Input
                value={socialMedia.youtube.url}
                onChange={(e) => handleSocialMediaChange('youtube', 'url', e.target.value)}
                placeholder="https://youtube.com/canal"
                className="flex-1"
              />
            )}
          </div>
          
          {/* TikTok */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="tiktok" 
                checked={socialMedia.tiktok.enabled}
                onCheckedChange={(checked) => 
                  handleSocialMediaChange('tiktok', 'enabled', checked === true)
                }
              />
              <Label htmlFor="tiktok" className="font-medium cursor-pointer">
                TikTok
              </Label>
            </div>
            {socialMedia.tiktok.enabled && (
              <Input
                value={socialMedia.tiktok.url}
                onChange={(e) => handleSocialMediaChange('tiktok', 'url', e.target.value)}
                placeholder="https://tiktok.com/@usuario"
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Seção de Plataformas de Streaming */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Plataformas de Streaming</h3>
        </div>
        
        <div className="space-y-3">
          {/* Spotify */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="spotify" 
                checked={streamingPlatforms.spotify.enabled}
                onCheckedChange={(checked) => 
                  handleStreamingChange('spotify', 'enabled', checked === true)
                }
              />
              <Label htmlFor="spotify" className="font-medium cursor-pointer">
                Spotify
              </Label>
            </div>
            {streamingPlatforms.spotify.enabled && (
              <Input
                value={streamingPlatforms.spotify.url}
                onChange={(e) => handleStreamingChange('spotify', 'url', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
                className="flex-1"
              />
            )}
          </div>
          
          {/* Apple Music */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="appleMusic" 
                checked={streamingPlatforms.appleMusic.enabled}
                onCheckedChange={(checked) => 
                  handleStreamingChange('appleMusic', 'enabled', checked === true)
                }
              />
              <Label htmlFor="appleMusic" className="font-medium cursor-pointer">
                Apple Music
              </Label>
            </div>
            {streamingPlatforms.appleMusic.enabled && (
              <Input
                value={streamingPlatforms.appleMusic.url}
                onChange={(e) => handleStreamingChange('appleMusic', 'url', e.target.value)}
                placeholder="https://music.apple.com/artist/..."
                className="flex-1"
              />
            )}
          </div>
          
          {/* Deezer */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="deezer" 
                checked={streamingPlatforms.deezer.enabled}
                onCheckedChange={(checked) => 
                  handleStreamingChange('deezer', 'enabled', checked === true)
                }
              />
              <Label htmlFor="deezer" className="font-medium cursor-pointer">
                Deezer
              </Label>
            </div>
            {streamingPlatforms.deezer.enabled && (
              <Input
                value={streamingPlatforms.deezer.url}
                onChange={(e) => handleStreamingChange('deezer', 'url', e.target.value)}
                placeholder="https://www.deezer.com/artist/..."
                className="flex-1"
              />
            )}
          </div>
          
          {/* SoundCloud */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="soundcloud" 
                checked={streamingPlatforms.soundcloud.enabled}
                onCheckedChange={(checked) => 
                  handleStreamingChange('soundcloud', 'enabled', checked === true)
                }
              />
              <Label htmlFor="soundcloud" className="font-medium cursor-pointer">
                SoundCloud
              </Label>
            </div>
            {streamingPlatforms.soundcloud.enabled && (
              <Input
                value={streamingPlatforms.soundcloud.url}
                onChange={(e) => handleStreamingChange('soundcloud', 'url', e.target.value)}
                placeholder="https://soundcloud.com/..."
                className="flex-1"
              />
            )}
          </div>
          
          {/* Amazon Music */}
          <div className="flex items-start space-x-3">
            <div className="flex h-5 items-center space-x-2">
              <Checkbox 
                id="amazonMusic" 
                checked={streamingPlatforms.amazonMusic.enabled}
                onCheckedChange={(checked) => 
                  handleStreamingChange('amazonMusic', 'enabled', checked === true)
                }
              />
              <Label htmlFor="amazonMusic" className="font-medium cursor-pointer">
                Amazon Music
              </Label>
            </div>
            {streamingPlatforms.amazonMusic.enabled && (
              <Input
                value={streamingPlatforms.amazonMusic.url}
                onChange={(e) => handleStreamingChange('amazonMusic', 'url', e.target.value)}
                placeholder="https://music.amazon.com/artists/..."
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Seção de Links Personalizados */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Outros Links</h3>
        </div>
        
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {socialLinks
              .filter(link => 
                !['instagram', 'facebook', 'youtube', 'tiktok', 'spotify', 'deezer', 'applemusic', 'soundcloud', 'amazonmusic']
                  .includes(link.platform.toLowerCase())
              )
              .map((link, index) => (
                <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                  {getSocialIcon(link.platform)}
                  <span className="max-w-[150px] truncate">{link.platform}</span>
                  <Button
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="socialPlatform">Plataforma</Label>
            <Input
              id="socialPlatform"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="bg-background"
              placeholder="Bandcamp, SoundBetter..."
              list="platform-suggestions"
            />
            <datalist id="platform-suggestions">
              {[...socialNetworksDB, ...platformsDB]
                .filter(platform => 
                  !['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Spotify', 'Deezer', 'Apple Music', 'SoundCloud', 'Amazon Music']
                    .includes(platform)
                )
                .map((platform, idx) => (
                  <option key={idx} value={platform} />
              ))}
            </datalist>
          </div>
          
          <div className="grid gap-2 flex-1">
            <Label htmlFor="socialUrl">URL</Label>
            <Input
              id="socialUrl"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-background"
              placeholder="https://..."
            />
          </div>
          
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={addSocialLink}
            disabled={!newPlatform || !newUrl}
            className="mb-[1px]"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Adicionar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
